package com.openai.mmdroid;

import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.content.SharedPreferences;
import android.database.Cursor;
import android.net.Uri;
import android.os.Bundle;
import android.os.Build;
import android.provider.OpenableColumns;
import android.provider.DocumentsContract;
import android.util.Base64;
import android.view.View;
import android.view.WindowManager;
import android.webkit.ConsoleMessage;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import androidx.documentfile.provider.DocumentFile;

import com.github.junrar.Junrar;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.FileOutputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

public class MainActivity extends Activity {
    private static final int WEB_FILE_CHOOSER_REQUEST = 401;
    private static final int NATIVE_PICKER_REQUEST = 402;
    private static final int NATIVE_SCENE_SAVE_REQUEST = 403;
    private static final int NATIVE_MODEL_DIR_REQUEST = 404;
    private static final int NATIVE_LIBRARY_ROOT_REQUEST = 405;

    private static final String PREFS_NAME = "mmdroid_library";
    private static final String PREF_LIBRARY_TREE = "library_parent_tree";
    private static final String LIB_ROOT_NAME = "mmddata";
    private static final String LIB_INDEX_NAME = "library_index.json";
    private static final String[] LIB_DIRS = {"model", "costume", "hair", "accessory", "item", "stage", "vmd", "music", "scene", "hdri", "output"};

    private WebView webView;
    private ValueCallback<Uri[]> pendingWebFileCallback;
    private String pendingNativeKind;
    private String pendingSceneJson;
    private List<Uri> pendingLooseModelUris = new ArrayList<>();
    private volatile boolean webUiReady = false;
    private volatile boolean libraryScanRunning = false;
    private volatile long lastLibraryScanAt = 0L;
    private final Object renderSaveLock = new Object();
    private OutputStream pendingRenderOutputStream = null;
    private String pendingRenderOutputName = null;
    private final Object modelExportLock = new Object();
    private OutputStream pendingModelExportStream = null;
    private String pendingModelExportName = null;
    private String pendingModelExportFolder = null;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        enterImmersiveMode();

        webView = new WebView(this);
        setContentView(webView);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setMediaPlaybackRequiresUserGesture(true);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(true);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);
        settings.setSupportZoom(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);

        // The UI is loaded from android_asset while imported documents are copied to
        // this app's private cache. These switches allow the page to read those files.
        settings.setAllowFileAccessFromFileURLs(true);
        settings.setAllowUniversalAccessFromFileURLs(true);

        webView.addJavascriptInterface(new NativeBridge(), "AndroidBridge");

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                String scheme = uri.getScheme();
                return !("file".equalsIgnoreCase(scheme)
                        || "https".equalsIgnoreCase(scheme)
                        || "blob".equalsIgnoreCase(scheme)
                        || "data".equalsIgnoreCase(scheme));
            }

            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                return super.shouldInterceptRequest(view, request);
            }
        });

        // Keep the normal WebView file chooser as a fallback. The app UI now uses the
        // native SAF bridge below because it is much more reliable across Android/WebView versions.
        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onShowFileChooser(WebView webView,
                                             ValueCallback<Uri[]> filePathCallback,
                                             FileChooserParams fileChooserParams) {
                if (pendingWebFileCallback != null) {
                    pendingWebFileCallback.onReceiveValue(null);
                }
                pendingWebFileCallback = filePathCallback;

                Intent intent;
                try {
                    intent = fileChooserParams.createIntent();
                } catch (Exception ignored) {
                    intent = new Intent(Intent.ACTION_OPEN_DOCUMENT);
                    intent.addCategory(Intent.CATEGORY_OPENABLE);
                    intent.setType("*/*");
                }
                intent.putExtra(Intent.EXTRA_ALLOW_MULTIPLE, true);
                intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION
                        | Intent.FLAG_GRANT_PERSISTABLE_URI_PERMISSION);

                try {
                    startActivityForResult(intent, WEB_FILE_CHOOSER_REQUEST);
                    return true;
                } catch (ActivityNotFoundException e) {
                    pendingWebFileCallback = null;
                    Toast.makeText(MainActivity.this,
                            "没有可用的系统文件选择器。",
                            Toast.LENGTH_LONG).show();
                    return false;
                }
            }

            @Override
            public boolean onConsoleMessage(ConsoleMessage consoleMessage) {
                android.util.Log.d("MMDroidJS",
                        consoleMessage.message() + " @" + consoleMessage.lineNumber());
                return true;
            }
        });

        webView.loadUrl("file:///android_asset/index.html");
    }

    public final class NativeBridge {
        @JavascriptInterface
        public void openPicker(String kind, boolean multiple) {
            runOnUiThread(() -> openNativePicker(kind, multiple));
        }

        @JavascriptInterface
        public void reopenUris(String kind, String uriJson) {
            final List<Uri> uris = new ArrayList<>();
            try {
                JSONArray arr = new JSONArray(uriJson == null ? "[]" : uriJson);
                for (int i = 0; i < arr.length(); i++) {
                    String value = arr.optString(i, "");
                    if (!value.isEmpty()) uris.add(Uri.parse(value));
                }
            } catch (JSONException e) {
                sendNativeError(kind, "场景中的文件引用无法解析：" + e.getMessage());
                return;
            }
            if (containsArchiveUri(uris)) {
                extractArchivesAndDeliver(kind, uris);
            } else {
                copyAndDeliver(kind, uris);
            }
        }

        @JavascriptInterface
        public void saveScene(String json, String suggestedName) {
            runOnUiThread(() -> openSceneSaveDialog(json, suggestedName));
        }

        @JavascriptInterface
        public void saveRenderImage(String dataUrl, String suggestedName) {
            saveRenderImageAsync(dataUrl, suggestedName);
        }

        @JavascriptInterface
        public boolean beginRenderImageSave(String suggestedName) {
            return beginRenderImageSaveNative(suggestedName);
        }

        @JavascriptInterface
        public boolean appendRenderImageChunk(String base64Chunk) {
            return appendRenderImageChunkNative(base64Chunk);
        }

        @JavascriptInterface
        public void finishRenderImageSave() {
            finishRenderImageSaveNative();
        }

        @JavascriptInterface
        public void abortRenderImageSave() {
            abortRenderImageSaveNative();
        }

        @JavascriptInterface
        public boolean beginModelExportSave(String suggestedName) {
            return beginModelExportSaveNative(suggestedName);
        }

        @JavascriptInterface
        public boolean appendModelExportChunk(String base64Chunk) {
            return appendModelExportChunkNative(base64Chunk);
        }

        @JavascriptInterface
        public void finishModelExportSave() {
            finishModelExportSaveNative();
        }

        @JavascriptInterface
        public void abortModelExportSave() {
            abortModelExportSaveNative();
        }

        @JavascriptInterface
        public String getStorageMode() {
            return "Android SAF mmddata resource library";
        }

        @JavascriptInterface
        public void uiReady() {
            webUiReady = true;
            runOnUiThread(() -> ensureLibraryPermissionAndRefresh());
        }

        @JavascriptInterface
        public void refreshLibrary() {
            refreshLibraryAsync(true);
        }

        @JavascriptInterface
        public void requestLibraryPermission() {
            runOnUiThread(() -> openLibraryRootPicker());
        }

        @JavascriptInterface
        public void openLibraryEntry(String category, String relativePath, String mainRelativePath) {
            openLibraryEntryAsync(category, relativePath, mainRelativePath);
        }
    }

    private void openNativePicker(String kind, boolean multiple) {
        pendingNativeKind = (kind == null || kind.trim().isEmpty()) ? "files" : kind;

        Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT);
        intent.addCategory(Intent.CATEGORY_OPENABLE);
        intent.putExtra(Intent.EXTRA_ALLOW_MULTIPLE, multiple);
        intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION
                | Intent.FLAG_GRANT_PERSISTABLE_URI_PERMISSION);

        String lower = pendingNativeKind.toLowerCase(Locale.ROOT);
        if (lower.startsWith("audio")) {
            intent.setType("audio/*");
        } else if (lower.startsWith("renderbackground") || lower.startsWith("image")) {
            intent.setType("image/*");
        } else {
            // PMX / PMD / VMD / FBX often have no registered MIME type on Android.
            // Using */* is intentional so the system document provider doesn't hide them.
            intent.setType("*/*");
        }

        try {
            startActivityForResult(intent, NATIVE_PICKER_REQUEST);
        } catch (ActivityNotFoundException e) {
            sendNativeError(pendingNativeKind, "没有找到系统文档选择器。请启用 Android 的“文件/文档”应用。");
        }
    }

    private boolean beginRenderImageSaveNative(String suggestedName) {
        synchronized (renderSaveLock) {
            abortRenderImageSaveNativeLocked(false);
            try {
                DocumentFile outDir = libraryDir("output", true);
                if (outDir == null) throw new IOException("mmddata/output 不可用，请先授权资源库目录");
                String name = sanitizeFileName(suggestedName == null ? "MMDroid_Render.png" : suggestedName.trim());
                if (name.isEmpty()) name = "MMDroid_Render.png";
                if (!name.toLowerCase(Locale.ROOT).endsWith(".png")) name += ".png";
                String base = baseName(name), candidate = name; int i = 2;
                while (outDir.findFile(candidate) != null) candidate = base + "_" + (i++) + ".png";
                DocumentFile target = outDir.createFile("image/png", candidate);
                if (target == null) throw new IOException("无法创建输出文件：" + candidate);
                OutputStream out = getContentResolver().openOutputStream(target.getUri(), "wt");
                if (out == null) throw new IOException("无法打开输出文件");
                pendingRenderOutputStream = out;
                pendingRenderOutputName = candidate;
                return true;
            } catch (Exception e) {
                abortRenderImageSaveNativeLocked(false);
                String msg = "高质量输出初始化失败：" + (e.getMessage() == null ? e.toString() : e.getMessage());
                evaluateJs("window.MMDroidNative && window.MMDroidNative.onRenderSaved && window.MMDroidNative.onRenderSaved(false," + JSONObject.quote(msg) + ");");
                return false;
            }
        }
    }

    private boolean appendRenderImageChunkNative(String base64Chunk) {
        synchronized (renderSaveLock) {
            try {
                if (pendingRenderOutputStream == null) throw new IOException("输出流尚未初始化");
                if (base64Chunk == null || base64Chunk.isEmpty()) return true;
                byte[] bytes = Base64.decode(base64Chunk, Base64.DEFAULT);
                pendingRenderOutputStream.write(bytes);
                return true;
            } catch (Exception e) {
                String msg = "高质量输出写入失败：" + (e.getMessage() == null ? e.toString() : e.getMessage());
                abortRenderImageSaveNativeLocked(false);
                evaluateJs("window.MMDroidNative && window.MMDroidNative.onRenderSaved && window.MMDroidNative.onRenderSaved(false," + JSONObject.quote(msg) + ");");
                return false;
            }
        }
    }

    private void finishRenderImageSaveNative() {
        synchronized (renderSaveLock) {
            try {
                if (pendingRenderOutputStream == null) throw new IOException("输出流尚未初始化");
                pendingRenderOutputStream.flush();
                pendingRenderOutputStream.close();
                pendingRenderOutputStream = null;
                String saved = pendingRenderOutputName == null ? "render.png" : pendingRenderOutputName;
                pendingRenderOutputName = null;
                evaluateJs("window.MMDroidNative && window.MMDroidNative.onRenderSaved && window.MMDroidNative.onRenderSaved(true," + JSONObject.quote("已保存到 mmddata/output/" + saved) + ");");
                scheduleLibraryRefresh();
            } catch (Exception e) {
                String msg = "高质量输出完成失败：" + (e.getMessage() == null ? e.toString() : e.getMessage());
                abortRenderImageSaveNativeLocked(false);
                evaluateJs("window.MMDroidNative && window.MMDroidNative.onRenderSaved && window.MMDroidNative.onRenderSaved(false," + JSONObject.quote(msg) + ");");
            }
        }
    }

    private void abortRenderImageSaveNative() {
        synchronized (renderSaveLock) { abortRenderImageSaveNativeLocked(false); }
    }

    private void abortRenderImageSaveNativeLocked(boolean notify) {
        if (pendingRenderOutputStream != null) {
            try { pendingRenderOutputStream.close(); } catch (Exception ignored) {}
        }
        pendingRenderOutputStream = null;
        pendingRenderOutputName = null;
        if (notify) evaluateJs("window.MMDroidNative && window.MMDroidNative.onRenderSaved && window.MMDroidNative.onRenderSaved(false,'输出已取消');");
    }

    private boolean beginModelExportSaveNative(String suggestedName) {
        synchronized (modelExportLock) {
            abortModelExportSaveNativeLocked(false);
            try {
                DocumentFile modelDir = libraryDir("model", true);
                if (modelDir == null) throw new IOException("mmddata/model 不可用，请先授权资源库目录");
                String name = sanitizeFileName(suggestedName == null ? "MMDroid_Character.glb" : suggestedName.trim());
                if (name.isEmpty()) name = "MMDroid_Character.glb";
                if (!name.toLowerCase(Locale.ROOT).endsWith(".glb")) name += ".glb";
                String folderBase = baseName(name);
                DocumentFile folder = createUniqueDirectory(modelDir, folderBase);
                DocumentFile target = folder.createFile("model/gltf-binary", name);
                if (target == null) target = folder.createFile("application/octet-stream", name);
                if (target == null) throw new IOException("无法创建导出模型：" + name);
                OutputStream out = getContentResolver().openOutputStream(target.getUri(), "wt");
                if (out == null) throw new IOException("无法打开模型导出文件");
                pendingModelExportStream = out;
                pendingModelExportName = name;
                pendingModelExportFolder = folder.getName();
                return true;
            } catch (Exception e) {
                abortModelExportSaveNativeLocked(false);
                String msg = "模型导出初始化失败：" + (e.getMessage() == null ? e.toString() : e.getMessage());
                evaluateJs("window.MMDroidNative && window.MMDroidNative.onModelExportSaved && window.MMDroidNative.onModelExportSaved(false," + JSONObject.quote(msg) + ");");
                return false;
            }
        }
    }

    private boolean appendModelExportChunkNative(String base64Chunk) {
        synchronized (modelExportLock) {
            try {
                if (pendingModelExportStream == null) throw new IOException("模型导出流尚未初始化");
                if (base64Chunk == null || base64Chunk.isEmpty()) return true;
                byte[] bytes = Base64.decode(base64Chunk, Base64.DEFAULT);
                pendingModelExportStream.write(bytes);
                return true;
            } catch (Exception e) {
                String msg = "模型导出写入失败：" + (e.getMessage() == null ? e.toString() : e.getMessage());
                abortModelExportSaveNativeLocked(false);
                evaluateJs("window.MMDroidNative && window.MMDroidNative.onModelExportSaved && window.MMDroidNative.onModelExportSaved(false," + JSONObject.quote(msg) + ");");
                return false;
            }
        }
    }

    private void finishModelExportSaveNative() {
        synchronized (modelExportLock) {
            try {
                if (pendingModelExportStream == null) throw new IOException("模型导出流尚未初始化");
                pendingModelExportStream.flush();
                pendingModelExportStream.close();
                pendingModelExportStream = null;
                String saved = pendingModelExportName == null ? "Character.glb" : pendingModelExportName;
                String folder = pendingModelExportFolder == null ? "" : pendingModelExportFolder + "/";
                pendingModelExportName = null; pendingModelExportFolder = null;
                evaluateJs("window.MMDroidNative && window.MMDroidNative.onModelExportSaved && window.MMDroidNative.onModelExportSaved(true," + JSONObject.quote("已导出到 mmddata/model/" + folder + saved) + ");");
                scheduleLibraryRefresh();
            } catch (Exception e) {
                String msg = "模型导出完成失败：" + (e.getMessage() == null ? e.toString() : e.getMessage());
                abortModelExportSaveNativeLocked(false);
                evaluateJs("window.MMDroidNative && window.MMDroidNative.onModelExportSaved && window.MMDroidNative.onModelExportSaved(false," + JSONObject.quote(msg) + ");");
            }
        }
    }

    private void abortModelExportSaveNative() {
        synchronized (modelExportLock) { abortModelExportSaveNativeLocked(false); }
    }

    private void abortModelExportSaveNativeLocked(boolean notify) {
        if (pendingModelExportStream != null) {
            try { pendingModelExportStream.close(); } catch (Exception ignored) {}
        }
        pendingModelExportStream = null;
        pendingModelExportName = null;
        pendingModelExportFolder = null;
        if (notify) evaluateJs("window.MMDroidNative && window.MMDroidNative.onModelExportSaved && window.MMDroidNative.onModelExportSaved(false,'模型导出已取消');");
    }

    private void saveRenderImageAsync(String dataUrl, String suggestedName) {
        new Thread(() -> {
            try {
                if (dataUrl == null || dataUrl.trim().isEmpty()) throw new IOException("输出图像为空");
                int comma = dataUrl.indexOf(',');
                String payload = comma >= 0 ? dataUrl.substring(comma + 1) : dataUrl;
                byte[] bytes = Base64.decode(payload, Base64.DEFAULT);
                DocumentFile outDir = libraryDir("output", true);
                if (outDir == null) throw new IOException("mmddata/output 不可用，请先授权资源库目录");
                String name = sanitizeFileName(suggestedName == null ? "MMDroid_Render.png" : suggestedName.trim());
                if (name.isEmpty()) name = "MMDroid_Render.png";
                if (!name.toLowerCase(Locale.ROOT).endsWith(".png")) name += ".png";
                String base = baseName(name), candidate = name; int i = 2;
                while (outDir.findFile(candidate) != null) candidate = base + "_" + (i++) + ".png";
                DocumentFile target = outDir.createFile("image/png", candidate);
                if (target == null) throw new IOException("无法创建输出文件：" + candidate);
                try (OutputStream out = getContentResolver().openOutputStream(target.getUri(), "wt")) {
                    if (out == null) throw new IOException("无法打开输出文件");
                    out.write(bytes); out.flush();
                }
                final String saved = candidate;
                evaluateJs("window.MMDroidNative && window.MMDroidNative.onRenderSaved && window.MMDroidNative.onRenderSaved(true," + JSONObject.quote("已保存到 mmddata/output/" + saved) + ");");
                scheduleLibraryRefresh();
            } catch (Exception e) {
                String msg = "高质量输出保存失败：" + (e.getMessage() == null ? e.toString() : e.getMessage());
                evaluateJs("window.MMDroidNative && window.MMDroidNative.onRenderSaved && window.MMDroidNative.onRenderSaved(false," + JSONObject.quote(msg) + ");");
            }
        }, "mmdroid-offline-render-save").start();
    }

    private void openSceneSaveDialog(String json, String suggestedName) {
        pendingSceneJson = json == null ? "{}" : json;
        String title = (suggestedName == null || suggestedName.trim().isEmpty())
                ? "MMDroidScene.mmdscene.json" : suggestedName.trim();
        if (!title.toLowerCase(Locale.ROOT).endsWith(".json")) title += ".json";

        Intent intent = new Intent(Intent.ACTION_CREATE_DOCUMENT);
        intent.addCategory(Intent.CATEGORY_OPENABLE);
        intent.setType("application/json");
        intent.putExtra(Intent.EXTRA_TITLE, title);
        intent.addFlags(Intent.FLAG_GRANT_WRITE_URI_PERMISSION | Intent.FLAG_GRANT_READ_URI_PERMISSION);
        try {
            startActivityForResult(intent, NATIVE_SCENE_SAVE_REQUEST);
        } catch (ActivityNotFoundException e) {
            pendingSceneJson = null;
            sendSceneSaved(false, "没有找到可用于保存场景的系统文档提供器。");
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if (requestCode == NATIVE_LIBRARY_ROOT_REQUEST) {
            if (resultCode != RESULT_OK || data == null || data.getData() == null) {
                sendLibraryUnavailable("未授权 mmddata 资源库目录；仍可临时导入文件。首次启动或点击资源库授权可再次设置。");
                return;
            }
            Uri treeUri = data.getData();
            tryPersistTreePermission(treeUri, data.getFlags());
            getSharedPreferences(PREFS_NAME, MODE_PRIVATE).edit().putString(PREF_LIBRARY_TREE, treeUri.toString()).apply();
            new Thread(() -> {
                try {
                    DocumentFile root = getMmdRoot(true);
                    if (root == null) throw new IOException("无法创建 mmddata 目录");
                    ensureLibraryStructure(root);
                    refreshLibraryAsync(true);
                } catch (Exception e) {
                    sendLibraryUnavailable("mmddata 初始化失败：" + (e.getMessage() == null ? e.toString() : e.getMessage()));
                }
            }, "mmdroid-library-init").start();
            return;
        }

        if (requestCode == WEB_FILE_CHOOSER_REQUEST) {
            handleWebChooserResult(resultCode, data);
            return;
        }

        if (requestCode == NATIVE_PICKER_REQUEST) {
            String kind = pendingNativeKind == null ? "files" : pendingNativeKind;
            pendingNativeKind = null;
            if (resultCode != RESULT_OK || data == null) {
                sendNativeCancelled(kind);
                return;
            }
            List<Uri> uris = collectUris(data);
            if (uris.isEmpty()) {
                sendNativeCancelled(kind);
                return;
            }
            for (Uri uri : uris) tryPersistPermission(uri, data.getFlags());
            if ("model".equalsIgnoreCase(kind)) {
                handleModelSelection(uris);
            } else {
                copyAndDeliver(kind, uris);
            }
            return;
        }

        if (requestCode == NATIVE_MODEL_DIR_REQUEST) {
            List<Uri> models = new ArrayList<>(pendingLooseModelUris);
            pendingLooseModelUris.clear();
            if (models.isEmpty()) {
                sendNativeCancelled("model");
                return;
            }
            if (resultCode != RESULT_OK || data == null || data.getData() == null) {
                // Directory grant is optional. The model itself still imports with safe preview material.
                copyAndDeliver("model", models);
                evaluateJs("window.MMDroidNative && window.MMDroidNative.onResourceFolderSkipped && window.MMDroidNative.onResourceFolderSkipped();");
                return;
            }
            Uri treeUri = data.getData();
            tryPersistTreePermission(treeUri, data.getFlags());
            scanTreeAndDeliver("model", treeUri, models);
            return;
        }

        if (requestCode == NATIVE_SCENE_SAVE_REQUEST) {
            String json = pendingSceneJson;
            pendingSceneJson = null;
            if (resultCode != RESULT_OK || data == null || data.getData() == null) {
                sendSceneSaved(false, "已取消保存场景");
                return;
            }
            Uri uri = data.getData();
            new Thread(() -> {
                try (OutputStream out = getContentResolver().openOutputStream(uri, "wt")) {
                    if (out == null) throw new IOException("无法打开输出流");
                    out.write((json == null ? "{}" : json).getBytes(StandardCharsets.UTF_8));
                    out.flush();
                    sendSceneSaved(true, "场景已保存");
                } catch (Exception e) {
                    sendSceneSaved(false, "场景保存失败：" + e.getMessage());
                }
            }, "mmdroid-scene-save").start();
        }
    }

    private void handleWebChooserResult(int resultCode, Intent data) {
        if (pendingWebFileCallback == null) return;
        Uri[] result = null;
        if (resultCode == RESULT_OK && data != null) {
            List<Uri> uris = collectUris(data);
            for (Uri uri : uris) tryPersistPermission(uri, data.getFlags());
            if (!uris.isEmpty()) result = uris.toArray(new Uri[0]);
        }
        pendingWebFileCallback.onReceiveValue(result);
        pendingWebFileCallback = null;
    }

    private List<Uri> collectUris(Intent data) {
        List<Uri> result = new ArrayList<>();
        if (data.getClipData() != null) {
            int count = data.getClipData().getItemCount();
            for (int i = 0; i < count; i++) {
                Uri uri = data.getClipData().getItemAt(i).getUri();
                if (uri != null) result.add(uri);
            }
        } else if (data.getData() != null) {
            result.add(data.getData());
        }
        return result;
    }

    private static final Set<String> MODEL_EXTENSIONS = new HashSet<>();
    private static final Set<String> RESOURCE_EXTENSIONS = new HashSet<>();
    static {
        String[] models = {"pmx", "pmd", "fbx", "glb", "gltf", "obj"};
        String[] resources = {"pmx", "pmd", "fbx", "glb", "gltf", "obj", "png", "jpg", "jpeg", "bmp", "tga", "webp", "gif", "dds", "spa", "sph", "mtl", "bin"};
        for (String e : models) MODEL_EXTENSIONS.add(e);
        for (String e : resources) RESOURCE_EXTENSIONS.add(e);
    }

    private static final class ImportItem {
        final File file;
        final Uri sourceUri;
        final String relativePath;
        boolean primaryModel;
        final String sourceType;

        ImportItem(File file, Uri sourceUri, String relativePath, boolean primaryModel, String sourceType) {
            this.file = file;
            this.sourceUri = sourceUri;
            this.relativePath = relativePath == null ? file.getName() : relativePath.replace('\\', '/');
            this.primaryModel = primaryModel;
            this.sourceType = sourceType;
        }
    }

    private void handleModelSelection(List<Uri> uris) {
        if (uris == null || uris.isEmpty()) {
            sendNativeCancelled("model");
            return;
        }
        if (containsArchiveUri(uris)) {
            extractArchivesAndDeliver("model", uris);
            return;
        }
        pendingLooseModelUris = new ArrayList<>(uris);
        openModelResourceTree(uris.get(0));
    }

    private boolean containsArchiveUri(List<Uri> uris) {
        if (uris == null) return false;
        for (Uri uri : uris) {
            String e = extensionOf(queryDisplayName(uri));
            if ("zip".equals(e) || "rar".equals(e)) return true;
        }
        return false;
    }

    private void openModelResourceTree(Uri modelUri) {
        Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT_TREE);
        intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION
                | Intent.FLAG_GRANT_WRITE_URI_PERMISSION
                | Intent.FLAG_GRANT_PERSISTABLE_URI_PERMISSION
                | Intent.FLAG_GRANT_PREFIX_URI_PERMISSION);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            Uri initial = guessParentDocumentUri(modelUri);
            if (initial != null) intent.putExtra(DocumentsContract.EXTRA_INITIAL_URI, initial);
        }
        try {
            Toast.makeText(this, "请确认模型所在文件夹；将自动扫描同级/子目录贴图。", Toast.LENGTH_SHORT).show();
            startActivityForResult(intent, NATIVE_MODEL_DIR_REQUEST);
        } catch (ActivityNotFoundException e) {
            List<Uri> fallback = new ArrayList<>(pendingLooseModelUris);
            pendingLooseModelUris.clear();
            copyAndDeliver("model", fallback);
        }
    }

    private Uri guessParentDocumentUri(Uri fileUri) {
        if (fileUri == null || !"content".equalsIgnoreCase(fileUri.getScheme())) return null;
        try {
            if (!DocumentsContract.isDocumentUri(this, fileUri)) return null;
            String docId = DocumentsContract.getDocumentId(fileUri);
            int slash = docId.lastIndexOf('/');
            if (slash <= 0) return null;
            String parentId = docId.substring(0, slash);
            return DocumentsContract.buildDocumentUri(fileUri.getAuthority(), parentId);
        } catch (Exception ignored) {
            return null;
        }
    }

    private void tryPersistTreePermission(Uri uri, int flags) {
        if (uri == null) return;
        int takeFlags = flags & (Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_GRANT_WRITE_URI_PERMISSION);
        if ((takeFlags & Intent.FLAG_GRANT_READ_URI_PERMISSION) == 0) takeFlags |= Intent.FLAG_GRANT_READ_URI_PERMISSION;
        try {
            getContentResolver().takePersistableUriPermission(uri, takeFlags);
        } catch (SecurityException ignored) {
        }
    }

    private void scanTreeAndDeliver(String kind, Uri treeUri, List<Uri> selectedModelUris) {
        new Thread(() -> {
            try {
                DocumentFile root = DocumentFile.fromTreeUri(this, treeUri);
                if (root == null || !root.isDirectory()) throw new IOException("无法读取所选资源目录");
                File sessionDir = new File(getCacheDir(), "imports/" + UUID.randomUUID() + "/tree");
                if (!sessionDir.mkdirs() && !sessionDir.isDirectory()) throw new IOException("无法创建资源扫描缓存目录");

                List<ImportItem> items = new ArrayList<>();
                int[] counters = new int[]{0, 0}; // files, bytes MB-ish guard handled by long below
                long[] totalBytes = new long[]{0L};
                scanDocumentTree(root, "", sessionDir, items, counters, totalBytes, 0);

                // If the provider did not expose the selected PMX under the granted tree, keep the explicitly selected model.
                for (Uri modelUri : selectedModelUris) {
                    boolean already = false;
                    for (ImportItem item : items) {
                        if (item.sourceUri != null && item.sourceUri.equals(modelUri)) { already = true; item.primaryModel = true; }
                    }
                    if (!already) {
                        String name = queryDisplayName(modelUri);
                        String safe = sanitizeFileName(name == null ? "model" : name);
                        File dst = new File(sessionDir, "__selected__/" + safe);
                        File parent = dst.getParentFile();
                        if (parent != null) parent.mkdirs();
                        copyUri(modelUri, dst);
                        items.add(new ImportItem(dst, modelUri, safe, true, "tree"));
                    }
                }

                if (!hasPrimaryModel(items)) markBestPrimaryModel(items);
                if ("model".equalsIgnoreCase(kind) && !items.isEmpty()) {
                    ImportItem primary = null;
                    for (ImportItem it : items) if (it.primaryModel) { primary = it; break; }
                    persistImportedItemsAsync("model", items, baseName(primary == null ? "model" : primary.file.getName()));
                }
                deliverImportItems(kind, items);
                int textureCount = 0;
                for (ImportItem item : items) if (isTextureExtension(extensionOf(item.relativePath))) textureCount++;
                sendResourceScanSummary(items.size(), textureCount, treeUri.toString());
            } catch (Exception e) {
                sendNativeError(kind, "同级目录扫描失败：" + (e.getMessage() == null ? e.toString() : e.getMessage()));
                copyAndDeliver(kind, selectedModelUris);
            }
        }, "mmdroid-tree-scan").start();
    }

    private void scanDocumentTree(DocumentFile dir, String prefix, File sessionDir, List<ImportItem> out,
                                  int[] counters, long[] totalBytes, int depth) throws IOException {
        if (depth > 24 || counters[0] > 5000 || totalBytes[0] > 2L * 1024L * 1024L * 1024L) return;
        DocumentFile[] children;
        try { children = dir.listFiles(); } catch (Exception e) { return; }
        for (DocumentFile child : children) {
            String name = child.getName();
            if (name == null || name.isEmpty()) continue;
            String rel = prefix.isEmpty() ? name : prefix + "/" + name;
            if (child.isDirectory()) {
                scanDocumentTree(child, rel, sessionDir, out, counters, totalBytes, depth + 1);
                continue;
            }
            if (!child.isFile() || !isRelevantResource(name)) continue;
            if (++counters[0] > 5000) break;
            long len = Math.max(0L, child.length());
            totalBytes[0] += len;
            if (totalBytes[0] > 2L * 1024L * 1024L * 1024L) break;
            File dst = safeDestination(sessionDir, rel);
            File parent = dst.getParentFile();
            if (parent != null && !parent.exists()) parent.mkdirs();
            copyUri(child.getUri(), dst);
            out.add(new ImportItem(dst, child.getUri(), rel, false, "tree"));
        }
    }

    private void extractArchivesAndDeliver(String kind, List<Uri> archiveUris) {
        new Thread(() -> {
            try {
                List<ImportItem> all = new ArrayList<>();
                for (Uri uri : archiveUris) {
                    String displayName = queryDisplayName(uri);
                    String archiveExt = extensionOf(displayName);
                    if (!("zip".equals(archiveExt) || "rar".equals(archiveExt))) continue;
                    File sessionDir = new File(getCacheDir(), "imports/" + UUID.randomUUID());
                    File extractDir = new File(sessionDir, "package");
                    if (!extractDir.mkdirs() && !extractDir.isDirectory()) throw new IOException("无法创建模型包缓存目录");
                    File archiveFile = new File(sessionDir, sanitizeFileName(displayName == null ? ("model." + archiveExt) : displayName));
                    copyUri(uri, archiveFile);
                    if ("zip".equals(archiveExt)) extractZip(archiveFile, extractDir);
                    else Junrar.extract(archiveFile, extractDir);
                    List<ImportItem> packageItems = collectExtractedResources(extractDir, uri);
                    if (packageItems.isEmpty()) throw new IOException("压缩包内没有可用的模型/贴图资源");
                    markBestPrimaryModel(packageItems);
                    if ("model".equalsIgnoreCase(kind) || "stage".equalsIgnoreCase(kind) || "accessory".equalsIgnoreCase(kind) || "costume".equalsIgnoreCase(kind) || "hair".equalsIgnoreCase(kind)) {
                        persistImportedItemsAsync(kind, packageItems, baseName(displayName));
                    }
                    if ("model".equalsIgnoreCase(kind)) all.addAll(filterItemsForMainModel(packageItems));
                    else all.addAll(packageItems);
                }
                if (all.isEmpty()) throw new IOException("没有找到 ZIP/RAR 模型包");
                deliverImportItems(kind, all);
                int textures = 0;
                for (ImportItem item : all) if (isTextureExtension(extensionOf(item.relativePath))) textures++;
                sendPackageSummary(all.size(), textures);
            } catch (Exception e) {
                sendNativeError(kind, "模型包导入失败：" + (e.getMessage() == null ? e.toString() : e.getMessage()));
            }
        }, "mmdroid-archive-import").start();
    }

    private void extractZip(File archive, File destination) throws IOException {
        String root = destination.getCanonicalPath() + File.separator;
        try (ZipInputStream zin = new ZipInputStream(new java.io.FileInputStream(archive))) {
            ZipEntry entry;
            byte[] buffer = new byte[1024 * 1024];
            while ((entry = zin.getNextEntry()) != null) {
                String raw = entry.getName().replace('\\', '/');
                if (raw.isEmpty()) { zin.closeEntry(); continue; }
                File out = new File(destination, raw);
                String canonical = out.getCanonicalPath();
                if (!canonical.startsWith(root)) throw new IOException("压缩包包含非法路径：" + raw);
                if (entry.isDirectory()) {
                    out.mkdirs();
                } else {
                    File parent = out.getParentFile();
                    if (parent != null && !parent.exists()) parent.mkdirs();
                    try (FileOutputStream fos = new FileOutputStream(out)) {
                        int n;
                        while ((n = zin.read(buffer)) >= 0) if (n > 0) fos.write(buffer, 0, n);
                    }
                }
                zin.closeEntry();
            }
        }
    }

    private List<ImportItem> collectExtractedResources(File root, Uri archiveUri) throws IOException {
        List<ImportItem> out = new ArrayList<>();
        collectExtractedRecursive(root, root, archiveUri, out, 0);
        return out;
    }

    private void collectExtractedRecursive(File root, File current, Uri archiveUri, List<ImportItem> out, int depth) throws IOException {
        if (depth > 32 || out.size() > 5000) return;
        File[] files = current.listFiles();
        if (files == null) return;
        for (File f : files) {
            if (f.isDirectory()) {
                collectExtractedRecursive(root, f, archiveUri, out, depth + 1);
            } else if (isRelevantResource(f.getName())) {
                String rel = root.toPath().relativize(f.toPath()).toString().replace(File.separatorChar, '/');
                out.add(new ImportItem(f, archiveUri, rel, false, "archive"));
            }
        }
    }

    private List<ImportItem> filterItemsForMainModel(List<ImportItem> items) {
        if (items == null || items.isEmpty()) return Collections.emptyList();
        ImportItem primary = null;
        for (ImportItem item : items) if (item.primaryModel) { primary = item; break; }
        if (primary == null) {
            markBestPrimaryModel(items);
            for (ImportItem item : items) if (item.primaryModel) { primary = item; break; }
        }
        if (primary == null) return new ArrayList<>(items);
        boolean hasParts = false;
        for (ImportItem item : items) {
            String rel = item.relativePath.toLowerCase(Locale.ROOT).replace('\\', '/');
            if (rel.contains("/parts/") || rel.startsWith("parts/")) { hasParts = true; break; }
        }
        if (!hasParts) return new ArrayList<>(items);
        List<ImportItem> out = new ArrayList<>();
        for (ImportItem item : items) {
            String rel = item.relativePath.toLowerCase(Locale.ROOT).replace('\\', '/');
            boolean underParts = rel.contains("/parts/") || rel.startsWith("parts/");
            if (underParts) continue;
            String ext = extensionOf(item.relativePath);
            if (MODEL_EXTENSIONS.contains(ext) && item != primary) continue;
            out.add(item);
        }
        if (!out.contains(primary)) out.add(primary);
        return out;
    }

    private void markBestPrimaryModel(List<ImportItem> items) {
        ImportItem best = items.stream()
                .filter(i -> MODEL_EXTENSIONS.contains(extensionOf(i.relativePath)))
                .min(Comparator.comparingInt((ImportItem i) -> modelPriority(extensionOf(i.relativePath)))
                        .thenComparingInt(i -> pathDepth(i.relativePath))
                        .thenComparing((ImportItem a, ImportItem b) -> Long.compare(b.file.length(), a.file.length())))
                .orElse(null);
        if (best != null) best.primaryModel = true;
    }

    private boolean hasPrimaryModel(List<ImportItem> items) {
        for (ImportItem item : items) if (item.primaryModel && MODEL_EXTENSIONS.contains(extensionOf(item.relativePath))) return true;
        return false;
    }

    private int modelPriority(String e) {
        if ("pmx".equals(e)) return 0;
        if ("pmd".equals(e)) return 1;
        if ("fbx".equals(e)) return 2;
        if ("glb".equals(e)) return 3;
        if ("gltf".equals(e)) return 4;
        if ("obj".equals(e)) return 5;
        return 99;
    }

    private int pathDepth(String path) {
        if (path == null || path.isEmpty()) return 0;
        int n = 0;
        for (int i = 0; i < path.length(); i++) if (path.charAt(i) == '/') n++;
        return n;
    }

    private boolean isRelevantResource(String name) {
        return RESOURCE_EXTENSIONS.contains(extensionOf(name));
    }

    private boolean isTextureExtension(String e) {
        return "png".equals(e) || "jpg".equals(e) || "jpeg".equals(e) || "bmp".equals(e)
                || "tga".equals(e) || "webp".equals(e) || "gif".equals(e) || "dds".equals(e)
                || "spa".equals(e) || "sph".equals(e);
    }

    private String extensionOf(String name) {
        if (name == null) return "";
        String clean = name.toLowerCase(Locale.ROOT);
        int q = clean.indexOf('?'); if (q >= 0) clean = clean.substring(0, q);
        int dot = clean.lastIndexOf('.');
        return dot >= 0 && dot + 1 < clean.length() ? clean.substring(dot + 1) : "";
    }

    private File safeDestination(File root, String relativePath) throws IOException {
        File out = new File(root, relativePath.replace('\\', '/'));
        String rootPath = root.getCanonicalPath() + File.separator;
        String outPath = out.getCanonicalPath();
        if (!outPath.startsWith(rootPath)) throw new IOException("非法资源路径：" + relativePath);
        return out;
    }

    private void deliverImportItems(String kind, List<ImportItem> items) {
        JSONArray payload = new JSONArray();
        for (ImportItem src : items) {
            try {
                JSONObject item = new JSONObject();
                item.put("name", new File(src.relativePath).getName());
                item.put("uri", src.sourceUri == null ? "" : src.sourceUri.toString());
                item.put("url", Uri.fromFile(src.file).toString());
                item.put("size", src.file.length());
                item.put("relativePath", src.relativePath);
                item.put("primaryModel", src.primaryModel);
                item.put("sourceType", src.sourceType);
                payload.put(item);
            } catch (JSONException ignored) {
            }
        }
        evaluateJs("window.MMDroidNative && window.MMDroidNative.onFilesSelected("
                + JSONObject.quote(kind) + "," + JSONObject.quote(payload.toString()) + ");");
    }

    private void sendPackageSummary(int resources, int textures) {
        evaluateJs("window.MMDroidNative && window.MMDroidNative.onPackageScanned && window.MMDroidNative.onPackageScanned("
                + resources + "," + textures + ");");
    }

    private void sendResourceScanSummary(int resources, int textures, String treeUri) {
        evaluateJs("window.MMDroidNative && window.MMDroidNative.onResourceFolderScanned && window.MMDroidNative.onResourceFolderScanned("
                + resources + "," + textures + "," + JSONObject.quote(treeUri) + ");");
    }

    private void copyAndDeliver(String kind, List<Uri> uris) {
        new Thread(() -> {
            File sessionDir = new File(getCacheDir(), "imports/" + UUID.randomUUID());
            if (!sessionDir.exists() && !sessionDir.mkdirs()) {
                sendNativeError(kind, "无法创建导入缓存目录");
                return;
            }
            List<ImportItem> items = new ArrayList<>();
            int index = 0;
            for (Uri uri : uris) {
                index++;
                try {
                    String displayName = queryDisplayName(uri);
                    if (displayName == null || displayName.trim().isEmpty()) displayName = "file_" + index;
                    String safeName = sanitizeFileName(displayName);
                    File dst = new File(sessionDir, index + "_" + safeName);
                    copyUri(uri, dst);
                    boolean primary = MODEL_EXTENSIONS.contains(extensionOf(displayName));
                    items.add(new ImportItem(dst, uri, displayName, primary, "document"));
                } catch (Exception e) {
                    sendNativeError(kind, "文件读取失败：" + (e.getMessage() == null ? e.toString() : e.getMessage()));
                }
            }
            if (items.isEmpty()) return;
            if (!hasPrimaryModel(items) && ("stage".equalsIgnoreCase(kind) || "accessory".equalsIgnoreCase(kind) || "costume".equalsIgnoreCase(kind) || "hair".equalsIgnoreCase(kind))) markBestPrimaryModel(items);
            ImportItem primary = null;
            for (ImportItem it : items) if (it.primaryModel) { primary = it; break; }
            persistImportedItemsAsync(kind, items, baseName(primary == null ? items.get(0).file.getName() : primary.file.getName()));
            deliverImportItems(kind, items);
        }, "mmdroid-file-copy").start();
    }


    private void ensureLibraryPermissionAndRefresh() {
        DocumentFile root = getMmdRoot(true);
        if (root == null || !root.canRead() || !root.canWrite()) {
            openLibraryRootPicker();
            return;
        }
        refreshLibraryAsync(false);
    }

    private void openLibraryRootPicker() {
        Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT_TREE);
        intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION
                | Intent.FLAG_GRANT_WRITE_URI_PERMISSION
                | Intent.FLAG_GRANT_PERSISTABLE_URI_PERMISSION
                | Intent.FLAG_GRANT_PREFIX_URI_PERMISSION);
        try {
            Toast.makeText(this, "请选择 mmddata 的存放位置；应用会自动创建资源库文件夹。", Toast.LENGTH_LONG).show();
            startActivityForResult(intent, NATIVE_LIBRARY_ROOT_REQUEST);
        } catch (ActivityNotFoundException e) {
            sendLibraryUnavailable("没有可用的系统目录选择器，无法创建 mmddata 资源库。");
        }
    }

    private DocumentFile getMmdRoot(boolean create) {
        SharedPreferences prefs = getSharedPreferences(PREFS_NAME, MODE_PRIVATE);
        String value = prefs.getString(PREF_LIBRARY_TREE, null);
        if (value == null || value.isEmpty()) return null;
        try {
            Uri treeUri = Uri.parse(value);
            DocumentFile selected = DocumentFile.fromTreeUri(this, treeUri);
            if (selected == null || !selected.exists() || !selected.isDirectory()) return null;
            DocumentFile root;
            if (LIB_ROOT_NAME.equalsIgnoreCase(selected.getName())) {
                root = selected;
            } else {
                root = selected.findFile(LIB_ROOT_NAME);
                if (root == null && create) root = selected.createDirectory(LIB_ROOT_NAME);
            }
            if (root != null && create) ensureLibraryStructure(root);
            return root;
        } catch (Exception e) {
            return null;
        }
    }

    private void ensureLibraryStructure(DocumentFile root) throws IOException {
        if (root == null || !root.isDirectory()) throw new IOException("mmddata 根目录不可用");
        for (String name : LIB_DIRS) {
            DocumentFile d = root.findFile(name);
            if (d == null) d = root.createDirectory(name);
            if (d == null || !d.isDirectory()) throw new IOException("无法创建资源目录：" + name);
        }
    }

    private DocumentFile libraryDir(String category, boolean create) throws IOException {
        DocumentFile root = getMmdRoot(create);
        if (root == null) return null;
        String name = normalizeCategory(category);
        DocumentFile d = root.findFile(name);
        if (d == null && create) d = root.createDirectory(name);
        return d;
    }

    private String normalizeCategory(String kind) {
        String k = kind == null ? "" : kind.toLowerCase(Locale.ROOT);
        if ("costume".equals(k) || "cloth".equals(k) || "clothing".equals(k) || "outfit".equals(k)) return "costume";
        if ("hair".equals(k) || "hairstyle".equals(k)) return "hair";
        if ("accessory".equals(k) || "item".equals(k) || "prop".equals(k)) return "accessory";
        if ("motion".equals(k) || "camera".equals(k) || "vmd".equals(k)) return "vmd";
        if ("audio".equals(k) || "music".equals(k)) return "music";
        if ("hdri".equals(k)) return "hdri";
        if ("scene".equals(k)) return "scene";
        if ("stage".equals(k)) return "stage";
        if ("output".equals(k)) return "output";
        return "model";
    }

    private String kindForCategory(String category) {
        String c = normalizeCategory(category);
        if ("vmd".equals(c)) return "motion";
        if ("music".equals(c)) return "audio";
        return c;
    }

    private String baseName(String name) {
        if (name == null || name.trim().isEmpty()) return "resource";
        String n = sanitizeFileName(name.trim());
        int dot = n.lastIndexOf('.');
        if (dot > 0) n = n.substring(0, dot);
        return n.isEmpty() ? "resource" : n;
    }

    private DocumentFile createUniqueDirectory(DocumentFile parent, String requested) throws IOException {
        if (parent == null) throw new IOException("资源库目录不可用");
        String base = sanitizeFileName(requested == null ? "resource" : requested);
        if (base.isEmpty()) base = "resource";
        String candidate = base;
        int i = 2;
        while (parent.findFile(candidate) != null) candidate = base + "_" + (i++);
        DocumentFile result = parent.createDirectory(candidate);
        if (result == null) throw new IOException("无法创建资源文件夹：" + candidate);
        return result;
    }

    private DocumentFile ensureChildDirectory(DocumentFile parent, String name) throws IOException {
        DocumentFile d = parent.findFile(name);
        if (d != null && d.isDirectory()) return d;
        d = parent.createDirectory(name);
        if (d == null) throw new IOException("无法创建目录：" + name);
        return d;
    }

    private void writeLocalFile(DocumentFile root, String relativePath, File source) throws IOException {
        String clean = relativePath == null ? source.getName() : relativePath.replace('\\', '/');
        while (clean.startsWith("/")) clean = clean.substring(1);
        String[] parts = clean.split("/");
        DocumentFile dir = root;
        for (int i = 0; i < parts.length - 1; i++) {
            String part = sanitizeFileName(parts[i]);
            if (!part.isEmpty() && !".".equals(part) && !"..".equals(part)) dir = ensureChildDirectory(dir, part);
        }
        String fileName = sanitizeFileName(parts.length == 0 ? source.getName() : parts[parts.length - 1]);
        DocumentFile old = dir.findFile(fileName);
        if (old != null && old.isFile()) old.delete();
        DocumentFile target = dir.createFile("application/octet-stream", fileName);
        if (target == null) throw new IOException("无法创建文件：" + fileName);
        try (InputStream in = new java.io.FileInputStream(source);
             OutputStream out = getContentResolver().openOutputStream(target.getUri(), "wt")) {
            if (out == null) throw new IOException("无法写入：" + fileName);
            byte[] buffer = new byte[1024 * 1024];
            int n;
            while ((n = in.read(buffer)) >= 0) if (n > 0) out.write(buffer, 0, n);
            out.flush();
        }
    }

    private DocumentFile persistPackageItems(String kind, List<ImportItem> items, String packageName) throws IOException {
        DocumentFile category = libraryDir(kind, true);
        if (category == null) return null;
        DocumentFile pack = createUniqueDirectory(category, packageName);
        for (ImportItem item : items) writeLocalFile(pack, item.relativePath, item.file);
        sendLibraryNotice("已加入 mmddata/" + normalizeCategory(kind) + "/" + pack.getName());
        scheduleLibraryRefresh();
        return pack;
    }

    private void persistLooseItems(String kind, List<ImportItem> items) throws IOException {
        DocumentFile category = libraryDir(kind, true);
        if (category == null) return;
        for (ImportItem item : items) {
            String name = sanitizeFileName(item.file.getName());
            DocumentFile existing = category.findFile(name);
            if (existing != null) {
                String base = baseName(name), ext = extensionOf(name);
                int i = 2;
                do { name = base + "_" + (i++) + (ext.isEmpty() ? "" : "." + ext); } while (category.findFile(name) != null);
            }
            writeLocalFile(category, name, item.file);
        }
        scheduleLibraryRefresh();
    }

    private void writeTextDocument(DocumentFile parent, String fileName, String mime, String text) throws IOException {
        if (parent == null) throw new IOException("目标目录不可用");
        String safe = sanitizeFileName(fileName);
        DocumentFile old = parent.findFile(safe);
        if (old != null && old.isFile()) old.delete();
        DocumentFile f = parent.createFile(mime == null ? "application/json" : mime, safe);
        if (f == null) throw new IOException("无法创建文件：" + safe);
        try (OutputStream out = getContentResolver().openOutputStream(f.getUri(), "wt")) {
            if (out == null) throw new IOException("无法写入文件：" + safe);
            out.write((text == null ? "" : text).getBytes(StandardCharsets.UTF_8));
            out.flush();
        }
    }

    private JSONObject readJsonDocument(DocumentFile f) {
        if (f == null || !f.isFile()) return null;
        try (InputStream in = getContentResolver().openInputStream(f.getUri())) {
            if (in == null) return null;
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            byte[] b = new byte[32 * 1024]; int n;
            while ((n = in.read(b)) >= 0) if (n > 0) out.write(b, 0, n);
            return new JSONObject(out.toString(StandardCharsets.UTF_8.name()));
        } catch (Exception e) { return null; }
    }

    private boolean isBundleDescriptorName(String name) {
        return name != null && name.toLowerCase(Locale.ROOT).endsWith(".mmdbundle.json");
    }

    private void createBundleDescriptor(String role, String displayName, String sourcePath, int partCount) throws IOException {
        DocumentFile category = libraryDir(role, true);
        if (category == null) return;
        JSONObject ref = new JSONObject();
        try {
            ref.put("format", "MMDroidBundleRef");
            ref.put("version", 1);
            ref.put("role", role);
            ref.put("displayName", displayName);
            ref.put("sourcePath", sourcePath);
            ref.put("partCount", Math.max(0, partCount));
            ref.put("createdAt", System.currentTimeMillis());
        } catch (JSONException e) { throw new IOException(e); }
        String fileName = sanitizeFileName(displayName) + ".mmdbundle.json";
        String candidate = fileName; int i = 2;
        while (category.findFile(candidate) != null) candidate = sanitizeFileName(displayName) + "_" + (i++) + ".mmdbundle.json";
        writeTextDocument(category, candidate, "application/json", ref.toString());
    }

    private int countRoleModels(List<ImportItem> items, String role) {
        int count = 0;
        if (items != null) for (ImportItem item : items) {
            if (MODEL_EXTENSIONS.contains(extensionOf(item.relativePath)) && rolePartPath(item.relativePath, role)) count++;
        }
        return count;
    }

    private void persistImportedItems(String kind, List<ImportItem> items, String packageName) throws IOException {
        String normalized = normalizeCategory(kind);
        if ("stage".equals(normalized) || "costume".equals(normalized) || "hair".equals(normalized) || "accessory".equals(normalized)) {
            persistPackageItems(normalized, items, packageName);
            return;
        }
        if ("model".equals(normalized)) {
            DocumentFile pack = persistPackageItems("model", items, packageName);
            if (pack != null) {
                String packName = pack.getName() == null ? sanitizeFileName(packageName) : pack.getName();
                String sourcePath = "model/" + packName;
                createBundleDescriptor("costume", packName + " · 服装", sourcePath, countRoleModels(items, "costume"));
                createBundleDescriptor("hair", packName + " · 头发", sourcePath, countRoleModels(items, "hair"));
                createBundleDescriptor("accessory", packName + " · 配件", sourcePath, countRoleModels(items, "accessory"));
                sendLibraryNotice("完整模型仅保存一份；已建立服装 / 头发 / 配件套装索引");
                scheduleLibraryRefresh();
            }
            return;
        }
        persistLooseItems(normalized, items);
    }

    private void persistImportedItemsAsync(String kind, List<ImportItem> items, String packageName) {
        final List<ImportItem> snapshot = new ArrayList<>(items == null ? Collections.emptyList() : items);
        final String safeKind = kind;
        final String safeName = packageName;
        new Thread(() -> {
            try {
                persistImportedItems(safeKind, snapshot, safeName);
            } catch (Exception e) {
                sendLibraryNotice("资源已载入；后台写入 mmddata 失败：" + (e.getMessage() == null ? e.toString() : e.getMessage()));
            }
        }, "mmdroid-library-persist").start();
    }

    private void scheduleLibraryRefresh() {
        new Thread(() -> {
            try {
                int tries = 0;
                while (libraryScanRunning && tries++ < 12) Thread.sleep(250L);
                refreshLibraryAsync(false);
            } catch (InterruptedException ignored) { Thread.currentThread().interrupt(); }
        }, "mmdroid-library-refresh-wait").start();
    }

    private static final class FolderStats {
        long size = 0L;
        long modified = 0L;
        int files = 0;
        int textures = 0;
        StringBuilder detail = new StringBuilder();
        String bestModel = null;
        int bestPriority = 999;
        int bestDepth = 999;
    }

    private void collectFolderStats(DocumentFile dir, String prefix, FolderStats stats, int depth) {
        if (dir == null || depth > 32) return;
        DocumentFile[] children;
        try { children = dir.listFiles(); } catch (Exception e) { return; }
        for (DocumentFile child : children) {
            String name = child.getName();
            if (name == null) continue;
            String rel = prefix.isEmpty() ? name : prefix + "/" + name;
            if (child.isDirectory()) { collectFolderStats(child, rel, stats, depth + 1); continue; }
            if (!child.isFile()) continue;
            stats.files++;
            stats.size += Math.max(0L, child.length());
            stats.modified = Math.max(stats.modified, Math.max(0L, child.lastModified()));
            String ext = extensionOf(name);
            stats.detail.append(rel).append('|').append(Math.max(0L, child.length())).append('|').append(Math.max(0L, child.lastModified())).append(';');
            if (isTextureExtension(ext)) stats.textures++;
            int pri = modelPriority(ext), dep = pathDepth(rel);
            if (pri < stats.bestPriority || (pri == stats.bestPriority && dep < stats.bestDepth)) {
                stats.bestPriority = pri; stats.bestDepth = dep;
                if (pri < 99) stats.bestModel = rel;
            }
        }
    }

    private boolean isWearableLibraryCategory(String category) {
        return "costume".equals(category) || "hair".equals(category) || "accessory".equals(category);
    }

    private boolean rolePartPath(String relativePath, String role) {
        if (relativePath == null || role == null) return false;
        String rel = relativePath.toLowerCase(Locale.ROOT).replace('\\', '/');
        int parts = rel.indexOf("/parts/");
        if (parts < 0 && rel.startsWith("parts/")) parts = -1;
        String tail;
        if (parts >= 0) tail = rel.substring(parts + 7);
        else if (rel.startsWith("parts/")) tail = rel.substring(6);
        else return false;
        int slash = tail.indexOf('/');
        String folder = slash >= 0 ? tail.substring(0, slash) : tail;
        if ("costume".equals(role)) return folder.contains("clothing") || folder.contains("cloth") || folder.contains("costume") || folder.contains("outfit");
        if ("hair".equals(role)) return folder.contains("hair") || folder.contains("hairstyle");
        if ("accessory".equals(role)) return folder.contains("accessory") || folder.contains("item") || folder.contains("prop");
        return false;
    }

    private void copyBundleRoleRecursive(DocumentFile dir, String prefix, File sessionDir, List<ImportItem> out,
                                         String role, int depth) throws IOException {
        if (dir == null || depth > 32) return;
        DocumentFile[] children;
        try { children = dir.listFiles(); } catch (Exception e) { return; }
        for (DocumentFile child : children) {
            String name = child.getName(); if (name == null) continue;
            String rel = prefix.isEmpty() ? name : prefix + "/" + name;
            if (child.isDirectory()) { copyBundleRoleRecursive(child, rel, sessionDir, out, role, depth + 1); continue; }
            if (!child.isFile() || !isRelevantResource(name) || !rolePartPath(rel, role)) continue;
            File dst = safeDestination(sessionDir, rel);
            File parent = dst.getParentFile(); if (parent != null) parent.mkdirs();
            copyUri(child.getUri(), dst);
            boolean primary = MODEL_EXTENSIONS.contains(extensionOf(name));
            out.add(new ImportItem(dst, child.getUri(), rel, primary, "library-bundle"));
        }
    }

    private JSONObject buildLibraryManifest(DocumentFile root) throws JSONException {
        JSONObject manifest = new JSONObject();
        manifest.put("format", "MMDroidLibrary");
        manifest.put("version", 1);
        manifest.put("rootName", LIB_ROOT_NAME);
        manifest.put("updatedAt", System.currentTimeMillis());
        JSONObject categories = new JSONObject();
        StringBuilder sig = new StringBuilder();
        for (String categoryName : LIB_DIRS) {
            JSONArray arr = new JSONArray();
            DocumentFile category = root.findFile(categoryName);
            List<DocumentFile> children = new ArrayList<>();
            if (category != null && category.isDirectory()) {
                try { Collections.addAll(children, category.listFiles()); } catch (Exception ignored) {}
            }
            children.sort(Comparator.comparing(a -> String.valueOf(a.getName()).toLowerCase(Locale.ROOT)));
            boolean hasBundleRefs = false, hasDirectoryPackages = false;
            for (DocumentFile child : children) {
                String childName = child.getName();
                if (isBundleDescriptorName(childName)) hasBundleRefs = true;
                if (child.isDirectory()) hasDirectoryPackages = true;
            }
            for (DocumentFile child : children) {
                String name = child.getName();
                if (name == null || name.equals(LIB_INDEX_NAME)) continue;
                if ("model".equals(categoryName) && hasDirectoryPackages && !child.isDirectory()) continue;
                if (isWearableLibraryCategory(categoryName) && hasBundleRefs && !child.isDirectory() && !isBundleDescriptorName(name)) continue;
                JSONObject e = new JSONObject();
                String path = categoryName + "/" + name;
                e.put("id", path);
                e.put("path", path);
                e.put("name", name);
                e.put("category", categoryName);
                if (isBundleDescriptorName(name)) {
                    JSONObject ref = readJsonDocument(child);
                    if (ref != null && "MMDroidBundleRef".equals(ref.optString("format", ""))) {
                        String display = ref.optString("displayName", baseName(name));
                        String role = ref.optString("role", categoryName);
                        String sourcePath = ref.optString("sourcePath", "");
                        long size = Math.max(0L, child.length()), mod = Math.max(0L, child.lastModified());
                        e.put("name", display);
                        e.put("displayName", display);
                        e.put("directory", false);
                        e.put("bundle", true);
                        e.put("bundleRole", role);
                        e.put("sourcePath", sourcePath);
                        e.put("bundlePartCount", Math.max(0, ref.optInt("partCount", 0)));
                        e.put("fileCount", 1);
                        e.put("textureCount", 0);
                        e.put("size", size);
                        e.put("modified", mod);
                        e.put("mainPath", path);
                        e.put("mainName", display);
                        e.put("type", "bundle");
                        sig.append(path).append('|').append(display).append('|').append(role).append('|').append(sourcePath).append('|').append(mod).append(';');
                        arr.put(e);
                        continue;
                    }
                }
                if (child.isDirectory()) {
                    FolderStats st = new FolderStats();
                    collectFolderStats(child, "", st, 0);
                    e.put("directory", true);
                    e.put("fileCount", st.files);
                    e.put("textureCount", st.textures);
                    e.put("size", st.size);
                    e.put("modified", st.modified);
                    if (st.bestModel != null) {
                        e.put("mainPath", path + "/" + st.bestModel);
                        e.put("mainName", new File(st.bestModel).getName());
                        e.put("type", extensionOf(st.bestModel));
                    }
                    sig.append(path).append('|').append(st.files).append('|').append(st.size).append('|').append(st.modified).append('|').append(st.bestModel).append('|').append(Integer.toHexString(st.detail.toString().hashCode())).append(';');
                } else {
                    long size = Math.max(0L, child.length()), mod = Math.max(0L, child.lastModified());
                    e.put("directory", false);
                    e.put("fileCount", 1);
                    e.put("textureCount", isTextureExtension(extensionOf(name)) ? 1 : 0);
                    e.put("size", size);
                    e.put("modified", mod);
                    e.put("mainPath", path);
                    e.put("mainName", name);
                    e.put("type", extensionOf(name));
                    sig.append(path).append('|').append(size).append('|').append(mod).append(';');
                }
                arr.put(e);
            }
            categories.put(categoryName, arr);
        }
        manifest.put("categories", categories);
        manifest.put("signature", Integer.toHexString(sig.toString().hashCode()));
        return manifest;
    }

    private JSONObject readLibraryIndex(DocumentFile root) {
        try {
            DocumentFile f = root.findFile(LIB_INDEX_NAME);
            if (f == null || !f.isFile()) return null;
            try (InputStream in = getContentResolver().openInputStream(f.getUri())) {
                if (in == null) return null;
                ByteArrayOutputStream out = new ByteArrayOutputStream();
                byte[] b = new byte[64 * 1024]; int n;
                while ((n = in.read(b)) >= 0) if (n > 0) out.write(b, 0, n);
                return new JSONObject(out.toString(StandardCharsets.UTF_8.name()));
            }
        } catch (Exception e) { return null; }
    }

    private void writeLibraryIndex(DocumentFile root, JSONObject manifest) throws IOException {
        DocumentFile old = root.findFile(LIB_INDEX_NAME);
        if (old != null && old.isFile()) old.delete();
        DocumentFile f = root.createFile("application/json", LIB_INDEX_NAME);
        if (f == null) throw new IOException("无法创建 " + LIB_INDEX_NAME);
        try (OutputStream out = getContentResolver().openOutputStream(f.getUri(), "wt")) {
            if (out == null) throw new IOException("无法写入 " + LIB_INDEX_NAME);
            out.write(manifest.toString().getBytes(StandardCharsets.UTF_8));
            out.flush();
        }
    }

    private void refreshLibraryAsync(boolean explicit) {
        if (libraryScanRunning) return;
        libraryScanRunning = true;
        new Thread(() -> {
            try {
                DocumentFile root = getMmdRoot(true);
                if (root == null) { sendLibraryUnavailable("mmddata 资源库尚未授权"); return; }
                JSONObject old = readLibraryIndex(root);
                if (old != null) sendLibraryManifest(old, false, true);
                JSONObject fresh = buildLibraryManifest(root);
                String oldSig = old == null ? "" : old.optString("signature", "");
                String newSig = fresh.optString("signature", "");
                boolean changed = old == null || !oldSig.equals(newSig);
                if (changed) writeLibraryIndex(root, fresh);
                sendLibraryManifest(fresh, changed, false);
                if (explicit) sendLibraryNotice(changed ? "资源库清单已更新" : "资源库清单无变化");
                lastLibraryScanAt = System.currentTimeMillis();
            } catch (Exception e) {
                sendLibraryUnavailable("资源库扫描失败：" + (e.getMessage() == null ? e.toString() : e.getMessage()));
            } finally {
                libraryScanRunning = false;
            }
        }, "mmdroid-library-scan").start();
    }

    private void sendLibraryManifest(JSONObject manifest, boolean changed, boolean scanning) {
        if (!webUiReady || manifest == null) return;
        evaluateJs("window.MMDroidNative && window.MMDroidNative.onLibraryManifest && window.MMDroidNative.onLibraryManifest("
                + JSONObject.quote(manifest.toString()) + "," + (changed ? "true" : "false") + "," + (scanning ? "true" : "false") + ");");
    }

    private void sendLibraryUnavailable(String message) {
        if (!webUiReady) return;
        evaluateJs("window.MMDroidNative && window.MMDroidNative.onLibraryUnavailable && window.MMDroidNative.onLibraryUnavailable("
                + JSONObject.quote(message == null ? "资源库不可用" : message) + ");");
    }

    private void sendLibraryNotice(String message) {
        if (!webUiReady) return;
        evaluateJs("window.MMDroidNative && window.MMDroidNative.onLibraryNotice && window.MMDroidNative.onLibraryNotice("
                + JSONObject.quote(message == null ? "" : message) + ");");
    }

    private DocumentFile findRelative(DocumentFile root, String relativePath) {
        if (root == null || relativePath == null) return null;
        String clean = relativePath.replace('\\', '/');
        DocumentFile cur = root;
        for (String part : clean.split("/")) {
            if (part.isEmpty() || ".".equals(part)) continue;
            if ("..".equals(part)) return null;
            cur = cur.findFile(part);
            if (cur == null) return null;
        }
        return cur;
    }

    private void copyMainModelRecursive(DocumentFile dir, String prefix, File sessionDir, List<ImportItem> out, int depth) throws IOException {
        if (dir == null || depth > 32) return;
        DocumentFile[] children;
        try { children = dir.listFiles(); } catch (Exception e) { return; }
        for (DocumentFile child : children) {
            String name = child.getName(); if (name == null) continue;
            String rel = prefix.isEmpty() ? name : prefix + "/" + name;
            String lower = rel.toLowerCase(Locale.ROOT).replace('\\', '/');
            boolean partsPath = lower.contains("/parts/") || lower.startsWith("parts/") || lower.endsWith("/parts");
            if (child.isDirectory()) {
                if (!partsPath) copyMainModelRecursive(child, rel, sessionDir, out, depth + 1);
                continue;
            }
            if (!child.isFile() || !isRelevantResource(name) || partsPath) continue;
            File dst = safeDestination(sessionDir, rel);
            File parent = dst.getParentFile(); if (parent != null) parent.mkdirs();
            copyUri(child.getUri(), dst);
            out.add(new ImportItem(dst, child.getUri(), rel, false, "library-main"));
        }
    }

    private void copyDocumentTreeToCache(DocumentFile dir, String prefix, File sessionDir, List<ImportItem> out, String mainPath, String entryBase, int depth) throws IOException {
        if (depth > 32) return;
        DocumentFile[] children;
        try { children = dir.listFiles(); } catch (Exception e) { return; }
        for (DocumentFile child : children) {
            String name = child.getName(); if (name == null) continue;
            String rel = prefix.isEmpty() ? name : prefix + "/" + name;
            if (child.isDirectory()) { copyDocumentTreeToCache(child, rel, sessionDir, out, mainPath, entryBase, depth + 1); continue; }
            if (!child.isFile() || !isRelevantResource(name)) continue;
            File dst = safeDestination(sessionDir, rel);
            File parent = dst.getParentFile(); if (parent != null) parent.mkdirs();
            copyUri(child.getUri(), dst);
            String full = entryBase + "/" + rel;
            out.add(new ImportItem(dst, child.getUri(), rel, full.equals(mainPath), "library"));
        }
    }

    private void openLibraryEntryAsync(String category, String relativePath, String mainRelativePath) {
        new Thread(() -> {
            try {
                DocumentFile root = getMmdRoot(false);
                if (root == null) throw new IOException("mmddata 资源库未授权");
                DocumentFile target = findRelative(root, relativePath);
                if (target == null || !target.exists()) throw new IOException("资源不存在：" + relativePath);
                String kind = kindForCategory(category);
                File sessionDir = new File(getCacheDir(), "library_open/" + UUID.randomUUID());
                if (!sessionDir.mkdirs() && !sessionDir.isDirectory()) throw new IOException("无法创建加载缓存");
                List<ImportItem> items = new ArrayList<>();
                String targetName = target.getName() == null ? "resource" : target.getName();
                if (target.isFile() && isBundleDescriptorName(targetName)) {
                    JSONObject ref = readJsonDocument(target);
                    if (ref == null || !"MMDroidBundleRef".equals(ref.optString("format", ""))) throw new IOException("套装索引损坏：" + targetName);
                    String role = normalizeCategory(ref.optString("role", category));
                    String sourcePath = ref.optString("sourcePath", "");
                    DocumentFile source = findRelative(root, sourcePath);
                    if (source == null || !source.isDirectory()) throw new IOException("套装源模型不存在：" + sourcePath);
                    copyBundleRoleRecursive(source, "", sessionDir, items, role, 0);
                    if (items.isEmpty()) {
                        List<ImportItem> fallback = new ArrayList<>();
                        copyDocumentTreeToCache(source, "", sessionDir, fallback, "", sourcePath, 0);
                        items.addAll(filterItemsForMainModel(fallback));
                        if (!hasPrimaryModel(items)) markBestPrimaryModel(items);
                    }
                    kind = role;
                } else if (target.isDirectory()) {
                    if ("model".equals(normalizeCategory(category))) copyMainModelRecursive(target, "", sessionDir, items, 0);
                    else copyDocumentTreeToCache(target, "", sessionDir, items, mainRelativePath, relativePath, 0);
                    if (!hasPrimaryModel(items)) markBestPrimaryModel(items);
                } else {
                    File dst = new File(sessionDir, sanitizeFileName(targetName));
                    copyUri(target.getUri(), dst);
                    items.add(new ImportItem(dst, target.getUri(), targetName, MODEL_EXTENSIONS.contains(extensionOf(targetName)), "library"));
                }
                if (items.isEmpty()) throw new IOException("资源目录中没有可加载文件");
                deliverImportItems(kind, items);
            } catch (Exception e) {
                sendNativeError(kindForCategory(category), "资源库加载失败：" + (e.getMessage() == null ? e.toString() : e.getMessage()));
            }
        }, "mmdroid-library-open").start();
    }

    private void copyUri(Uri uri, File destination) throws IOException {
        try (InputStream in = getContentResolver().openInputStream(uri);
             FileOutputStream out = new FileOutputStream(destination)) {
            if (in == null) throw new IOException("无法读取文件：" + uri);
            byte[] buffer = new byte[1024 * 1024];
            int n;
            while ((n = in.read(buffer)) >= 0) {
                if (n > 0) out.write(buffer, 0, n);
            }
            out.flush();
        }
    }

    private String queryDisplayName(Uri uri) {
        if (uri == null) return null;
        if ("content".equalsIgnoreCase(uri.getScheme())) {
            try (Cursor cursor = getContentResolver().query(uri,
                    new String[]{OpenableColumns.DISPLAY_NAME}, null, null, null)) {
                if (cursor != null && cursor.moveToFirst()) {
                    int index = cursor.getColumnIndex(OpenableColumns.DISPLAY_NAME);
                    if (index >= 0) return cursor.getString(index);
                }
            } catch (Exception ignored) {
            }
        }
        String last = uri.getLastPathSegment();
        return last == null ? null : last.substring(last.lastIndexOf('/') + 1);
    }

    private String sanitizeFileName(String name) {
        String result = name.replaceAll("[\\\\/:*?\"<>|\\p{Cntrl}]", "_");
        if (result.length() > 180) result = result.substring(result.length() - 180);
        return result.isEmpty() ? "file" : result;
    }

    private void tryPersistPermission(Uri uri, int flags) {
        if (uri == null || !"content".equalsIgnoreCase(uri.getScheme())) return;
        int takeFlags = flags & (Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_GRANT_WRITE_URI_PERMISSION);
        if ((takeFlags & Intent.FLAG_GRANT_READ_URI_PERMISSION) == 0) {
            takeFlags |= Intent.FLAG_GRANT_READ_URI_PERMISSION;
        }
        try {
            getContentResolver().takePersistableUriPermission(uri, takeFlags);
        } catch (SecurityException ignored) {
            // Some providers only grant a temporary read URI. The current import still works.
        }
    }

    private void sendNativeCancelled(String kind) {
        evaluateJs("window.MMDroidNative && window.MMDroidNative.onPickerCancelled("
                + JSONObject.quote(kind) + ");");
    }

    private void sendNativeError(String kind, String message) {
        evaluateJs("window.MMDroidNative && window.MMDroidNative.onNativeError("
                + JSONObject.quote(kind) + "," + JSONObject.quote(message) + ");");
    }

    private void sendSceneSaved(boolean ok, String message) {
        evaluateJs("window.MMDroidNative && window.MMDroidNative.onSceneSaved("
                + (ok ? "true" : "false") + "," + JSONObject.quote(message) + ");");
    }

    private void evaluateJs(String script) {
        runOnUiThread(() -> {
            if (webView != null) webView.evaluateJavascript(script, null);
        });
    }

    private void enterImmersiveMode() {
        getWindow().getDecorView().setSystemUiVisibility(
                View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                        | View.SYSTEM_UI_FLAG_FULLSCREEN
                        | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                        | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                        | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                        | View.SYSTEM_UI_FLAG_LAYOUT_STABLE
        );
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) enterImmersiveMode();
    }

    @Override
    protected void onPause() {
        if (webView != null) webView.onPause();
        super.onPause();
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (webView != null) webView.onResume();
        enterImmersiveMode();
        if (webUiReady && System.currentTimeMillis() - lastLibraryScanAt > 5000L) refreshLibraryAsync(false);
    }

    @Override
    protected void onDestroy() {
        if (pendingWebFileCallback != null) {
            pendingWebFileCallback.onReceiveValue(null);
            pendingWebFileCallback = null;
        }
        if (webView != null) {
            webView.removeJavascriptInterface("AndroidBridge");
            webView.loadUrl("about:blank");
            webView.destroy();
        }
        super.onDestroy();
    }
}
