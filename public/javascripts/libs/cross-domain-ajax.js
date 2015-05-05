/**
 * jQuery.ajax mid - CROSS DOMAIN AJAX
 * ---
 * @author James Padolsey (http://james.padolsey.com)
 * @version 0.11
 * @updated 12-JAN-10
 * ---
 * Note: Read the README!
 * ---
 * @info http://james.padolsey.com/javascript/cross-domain-requests-with-jquery/
 */

jQuery.ajax=function(e){function o(e){return!r.test(e)&&/:\/\//.test(e)}var t=location.protocol,n=location.hostname,r=RegExp(t+"//"+n),i="http"+(/^https/.test(t)?"s":"")+"://query.yahooapis.com/v1/public/yql?callback=?",s='select * from html where url="{URL}" and xpath="*"';return function(t){var n=t.url;if(/get/i.test(t.type)&&!/json/i.test(t.dataType)&&o(n)){t.url=i;t.dataType="json";t.data={q:s.replace("{URL}",n+(t.data?(/\?/.test(n)?"&":"?")+jQuery.param(t.data):"")),format:"xml"};if(!t.success&&t.complete){t.success=t.complete;delete t.complete}t.success=function(e){return function(t){if(e){e.call(this,{responseText:(t.results[0]||"").replace(/<script[^>]+?\/>|<script(.|\s)*?\/script>/gi,"")},"success")}}}(t.success)}return e.apply(this,arguments)}}(jQuery.ajax)