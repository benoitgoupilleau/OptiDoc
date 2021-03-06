package com.optidoc;

import android.app.Application;

import com.facebook.react.ReactApplication;
import io.sentry.RNSentryPackage;
import com.reactnativecommunity.netinfo.NetInfoPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.imagepicker.ImagePickerPackage;
import com.anyline.RNImageToPDF.RNImageToPdfPackage;
import com.hopding.pdflib.PDFLibPackage;
import com.vinzscam.reactnativefileviewer.RNFileViewerPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import org.wonday.pdf.RCTPdfView;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.rnfs.RNFSPackage;
import com.github.yamill.orientation.OrientationPackage;


import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
        new MainReactPackage(),
        new RNSentryPackage(),
        new RNDeviceInfo(),
        new ImagePickerPackage(),
        new PDFLibPackage(),
        new RNFileViewerPackage(),
        new RNFetchBlobPackage(),
        new RNFSPackage(),
        new VectorIconsPackage(),
        new RCTPdfView(),
        new RNGestureHandlerPackage(),
        new RNImageToPdfPackage(),
        new OrientationPackage(),
        new NetInfoPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
