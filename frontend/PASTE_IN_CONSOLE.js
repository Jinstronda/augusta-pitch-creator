// COPY THIS ENTIRE SCRIPT AND PASTE IT INTO THE BROWSER CONSOLE (F12)
// Then press Enter to run it

(async function() {
  const ednData = `{:format :pointed-dict, :data [{#uuid "ff0051ea-2479-4922-b67e-04ab2bbea9c3" {:updated-at 1726717935090, :entity-type :font, :events [], :type "custom", :keyspace [:workspace #uuid "115577da-7857-4831-9fc4-c520aa2009cb"], :id #uuid "ff0051ea-2479-4922-b67e-04ab2bbea9c3", :styles [{:name "300 Italic", :style "italic", :weight 300, :sources [{:url "https://pitch-assets-ccb95893-de3f-4266-973c-20049231b248.s3.eu-west-1.amazonaws.com/fonts/09adb1f6-a700-4ba7-a69a-fbd373b5f0d3.woff", :format "woff"}]} {:name "300", :style "normal", :weight 300, :sources [{:url "https://pitch-assets-ccb95893-de3f-4266-973c-20049231b248.s3.eu-west-1.amazonaws.com/fonts/e8e7a9a8-4740-4ec6-903a-f76e1547888f.woff", :format "woff"}]} {:name "400 Italic", :style "italic", :weight 400, :sources [{:url "https://pitch-assets-ccb95893-de3f-4266-973c-20049231b248.s3.eu-west-1.amazonaws.com/fonts/71bb8a9f-857a-4094-aba7-67880347413c.woff", :format "woff"}]} {:name "400", :style "normal", :weight 400, :sources [{:url "https://pitch-assets-ccb95893-de3f-4266-973c-20049231b248.s3.eu-west-1.amazonaws.com/fonts/2c948cd8-7a1b-4faa-a5a4-e13eec656717.woff", :format "woff"}]} {:name "500", :style "normal", :weight 500, :sources [{:url "https://pitch-assets-ccb95893-de3f-4266-973c-20049231b248.s3.eu-west-1.amazonaws.com/fonts/c8ef3205-959f-4387-bdd1-b01c7343b583.woff", :format "woff"}]} {:name "550", :style "italic", :weight 500, :sources [{:url "https://pitch-assets-ccb95893-de3f-4266-973c-20049231b248.s3.eu-west-1.amazonaws.com/fonts/e9860aba-c865-4748-8fc0-79cf980868eb.woff", :format "woff"}]} {:name "600", :style "normal", :weight 600, :sources [{:url "https://pitch-assets-ccb95893-de3f-4266-973c-20049231b248.s3.eu-west-1.amazonaws.com/fonts/dae0dbb5-3984-4f40-a3c1-e778f41085e5.woff", :format "woff"}]} {:name "600 (IT)", :style "italic", :weight 600, :sources [{:url "https://pitch-assets-ccb95893-de3f-4266-973c-20049231b248.s3.eu-west-1.amazonaws.com/fonts/b83dc5a6-75de-4850-aad3-a56960d7dad8.woff", :format "woff"}]} {:name "700", :style "normal", :weight 700, :sources [{:url "https://pitch-assets-ccb95893-de3f-4266-973c-20049231b248.s3.eu-west-1.amazonaws.com/fonts/d6e6ff8b-3b98-4a7d-8d2e-bf7e121be581.woff", :format "woff"}]}], :created-at 1726717935090, :font-family "TWK Lausanne"}, #uuid "93b97327-cb88-4bca-8655-7375af8a7e1b" {:fill-color {:r 229, :g 231, :b 240, :a 1}, :entity-type :block, :shape-type :rectangle, :coords {:x-start 0.02129391832473064, :x-end 0.9787011058247308, :y-start 0.17619231250995154, :y-end 0.17804416436180343}, :events [], :border? true, :even-padding? true, :border-width 0, :block-type :shape, :border-color {:r 229, :g 231, :b 240, :a 1}, :arrowhead-type :triangle}, #uuid "9cdf637d-b740-43c9-b2d3-8d110ca9739c" {:fill-color {:r 255, :g 255, :b 255, :a 0.16}, :entity-type :block, :shape-type :rectangle, :white-space :break-spaces, :coords {:y-start 0.3009473277573468, :x-start 0.5210173553509607, :x-end 0.6159556379458019, :y-end 0.3324288092388282}, :events [], :border? true, :even-padding? true, :variation :rectangle-outline-radius, :border-width 1, :block-type :shape, :border-color {:r 255, :g 255, :b 255, :a 0.19}, :corner-roundness 0.25, :body "<p></p>", :arrowhead-type :triangle}, #uuid "990b65c7-b579-4d28-bd8d-66092e59010e" {:line-height 1.1, :entity-type :block, :text-align :left, :white-space :break-spaces, :font-size 0.65, :font-weight 500, :auto-resize? false, :auto-align-default :left, :coords {:y-start 0.35109663751143705, :x-start 0.2799023870069679, :x-end 0.4626538518507179, :y-end 0.40404802640032594}, :events [], :text-color {:r 255, :g 255, :b 255, :a 1}, :auto-vertical-align-default :top, :text-align-vertical :top, :text-type :headline-medium, :used-fonts #{#uuid "ff00e4cf-60ba-4f16-951a-72c5311ef140"}, :block-type :text, :body "<p>PE-Backed Dental Clinic Chain in Portugal</p>"}]}`;

  console.log('🚀 Starting Pitch.com slide paste...');
  console.log('📋 EDN data length:', ednData.length, 'characters');

  try {
    // Write to clipboard
    await navigator.clipboard.writeText(ednData);
    console.log('✅ Clipboard updated with EDN data');

    // Find canvas
    const canvas = document.getElementById('canvas');
    if (!canvas) {
      console.error('❌ Canvas not found!');
      return;
    }

    console.log('✅ Canvas found, focusing...');
    canvas.focus();
    await new Promise(r => setTimeout(r, 500));

    console.log('📝 Now manually press Ctrl+V to paste!');
    console.log('   OR run this in console: document.execCommand("paste")');

  } catch (e) {
    console.error('❌ Error:', e.message);
  }
})();
