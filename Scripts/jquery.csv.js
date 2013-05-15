/* Usage:
 *  jQuery.csv()(csvtext)                    returns an array of arrays representing the CSV text.
 *  jQuery.csv("\t", "\r\n")(tsvtext)        uses Tab as a delimiter (comma is the default)
 *  jQuery.csv("\t", "\r\n", "'")(tsvtext)   uses a single quote as the quote character instead of double quotes
 *  jQuery.csv("\t", "\r\n", "'\"")(tsvtext) uses single & double quotes as the quote character
 */
;
jQuery.extend({
    csv: function(delim, lf, quote, lined) {
        delim = typeof delim == "string" ? new RegExp( "[" + (delim || ","   ) + "]" ) : typeof delim == "undefined" ? ","    : delim;
        lf    = typeof delim == "string" ? new RegExp( "[" + (lf || "\n"   ) + "]" ) : typeof lf == "undefined" ? "\n"    : lf;
        quote = typeof quote == "string" ? new RegExp("^[" + (quote || '"'   ) + "]" ) : typeof quote == "undefined" ? '"'    : quote;
        lined = typeof lined == "string" ? new RegExp( "[" + (lined || lf) + "]+") : typeof lined == "undefined" ? lf : lined;
 
        function splitline (v) {
            // Split the line using the delimitor
            var arr  = v.split(delim),
                out = [], q;
            for (var i=0, l=arr.length; i<l; i++) {
                if (q = arr[i].match(quote)) {
                    for (j=i; j<l; j++) {
                        if (arr[j].charAt(arr[j].length-1) == q[0]) { break; }
                    }
                    var s = arr.slice(i,j+1).join(delim);
                    out.push(s.substr(1,s.length-2));
                    i = j;
                }
                else { out.push(arr[i]); }
            }
 
            return out;
        }
 
        return function(text) {
            var lines = text.split(lined);
            for (var i=0, l=lines.length; i<l; i++) {
                lines[i] = splitline(lines[i]);
            }
            return lines;
        };
    }
});