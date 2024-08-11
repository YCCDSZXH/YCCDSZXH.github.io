(function () {
  var webSdkScript = document.createElement("script");

  // fetch the latest version of the Web-SDK from the CDN
  webSdkScript.src =
    "https://unpkg.com/@grafana/faro-web-sdk@^1.4.0/dist/bundle/faro-web-sdk.iife.js";

  webSdkScript.onload = () => {
    window.GrafanaFaroWebSdk.initializeFaro({
      url: "https://faro-collector-prod-ap-southeast-1.grafana.net/collect/10ae0849f18f5001291159496418c380",
      app: {
        name: "blog",
        version: "0.2.0",
        environment: "production",
      },
    });

    // Load instrumentations at the onLoad event of the web-SDK and after the above configuration.
    // This is important because we need to ensure that the Web-SDK has been loaded and initialized before we add further instruments!
    var webTracingScript = document.createElement("script");

    // fetch the latest version of the Web Tracing package from the CDN
    webTracingScript.src =
      "https://unpkg.com/@grafana/faro-web-tracing@^1.4.0/dist/bundle/faro-web-tracing.iife.js";

    // Initialize, configure (if necessary) and add the the new instrumentation to the already loaded and configured Web-SDK.
    webTracingScript.onload = () => {
      window.GrafanaFaroWebSdk.faro.instrumentations.add(
        new window.GrafanaFaroWebTracing.TracingInstrumentation()
      );
    };

    // Append the Web Tracing script script tag to the HTML page
    document.head.appendChild(webTracingScript);
  };

  // Append the Web-SDK script script tag to the HTML page
  document.head.appendChild(webSdkScript);
})();
