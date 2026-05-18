var ipaSQL = [];
var ipadb;

self.addEventListener('fetch', function (event) {
    event.respondWith(
      caches.match(event.request).then(function (request) {
          return request || fetch(event.request)
      })
    )
})

//self.addEventListener('install', function (event) {
//    event.waitUntil(
//      caches.open('v1').then(function (cache) {
//          return cache.addAll([
//            '../Resources/ipa.jpg',
//          ]);
//      })
//    );
//});

// Connect to sqlite db file

function TaiNueaIPA(w, accent) {
    var ipastr = "";
    var ipa = {};
    ipa.onset = "", ipa.rime = "", ipa.tone = "", ipa.toneclass = 0;
    w = w.replace('᧑', 'ᥢᥪᥒ');
	if (w=='ᥨ') w = 'ᥔᥩᥒᥴ';
    w = w.replace('၃', 'ᥔᥣᥛᥴ');
    w = w.replace('၄', 'ᥔᥤᥱ');
    w = w.replace('၅', 'ᥞᥣᥲ');
    w = w.replace('᧖', 'ᥞᥨᥐᥱ');
    w = w.replace('၇', 'ᥓᥥᥖᥱ');
    w = w.replace('᧘', 'ᥙᥦᥖᥱ');
    w = w.replace('᧙', 'ᥐᥝᥲ');
    for (var i = 0; i < w.length; i++) {
        var c = w.charAt(i);
        if ("ᥐᥑᥒᥓᥔᥕᥖᥗᥘᥙᥚᥛᥜᥝᥞᥟᥠᥡᥢ".includes(c)) {
            if (ipa.onset == "") {
                ipa.onset = c;
            }
			else {
                if ("ᥙᥖᥐ".includes(c)) {
                    if ((!ipa.rime == "") && ("ᥣᥦᥩ".includes(ipa.rime))) {
                            ipa.tone = "50";
                        }
                        else {
                            ipa.tone = "40";
                        }
                }
				if (ipa.rime == "") {
                    ipa.rime += ("-" + c);
                }
                else {
                    ipa.rime += c;
                }
            }
        }
        else if ("ᥴᥰᥱᥲᥳ".includes(c)) {
            if (ipa.tone == "") {
                ipa.tone = c;
            } else if (c == "ᥴ") {
                ipa.tone = "4ᥴ";
            } else if (c == "ᥱ") {
                ipa.tone = "5ᥱ";
            }
        }
        else {
            ipa.rime += c;
        }
    }

    if (ipa.tone == "") {
        ipa.tone = "0";
    }
	
	if (ipa.onset == "") {
        ipa.onset = "0";
    }
	
	
	ipaSQL = ipadb.exec("SELECT " + accent + " FROM TaiNuea where phone='" + ipa.onset + "' ");
    if (ipaSQL.length > 0)
        ipa.onset = ipaSQL[0].values[0][0];
    else
        return "∅";
    ipaSQL = ipadb.exec("SELECT " + accent + " FROM TaiNuea where phone='" + ipa.rime + "' ");
    if (ipaSQL.length > 0)
        ipa.rime = ipaSQL[0].values[0][0];
    else
        return "∅";
    ipaSQL = ipadb.exec("SELECT " + accent + " FROM TaiNuea where phone='" + ipa.tone + "' ");
    if (ipaSQL.length > 0)
        ipa.tone = ipaSQL[0].values[0][0];
    else
        return "∅";

        if (accent == "roman") {
            /*
			-ipa.onset = ipa.onset.replace("̤", "");
            if ((ipa.onset == "k") && !ipa.rime.startsWith("i") && !ipa.rime.startsWith("e") && !ipa.rime.startsWith("ê")) {
                ipa.onset = ipa.onset.replace("k", "c").replace("g", "gh").replace("ng", "ngh");
            }
            if (ipa.rime.startsWith("i") || ipa.rime.startsWith("ơ") || ipa.rime.startsWith("ê") || ipa.rime.startsWith("â")) {
                ipa.onset = ipa.onset.replace("w", "u");
            } else {
                ipa.onset = ipa.onset.replace("w", "o");
            }
			*/
			ipastr = " " + ((ipa.onset == 'ʔ') ? '' : ipa.onset) + ipa.rime + ipa.tone.replace("ˀ","").replace("7","5");
        }
		else
			ipastr = " " + ipa.onset + ipa.rime + ipa.tone;
		
	/*
	while (ipalist.length != 0) {
        var ipatmp = ipalist.pop();
        var minortone = "";
        ipaSQL = ipadb.exec("SELECT " + accent + " FROM TaiLue where phone='ˀ" + ipatmp.toneclass + "' ");
        if (ipaSQL.length > 0)
            minortone = ipaSQL[0].values[0];
        var onsets = [ipatmp.onset];
        if (ipatmp.onset2.endsWith("1")) {
            onsets = onsets.concat(ipatmp.onset2.slice(0, -2).split(''));
            ipatmp.onset2 = ipatmp.onset2.slice(-2);
        }
        else {
            onsets = onsets.concat(ipatmp.onset2.split(''));
            ipatmp.onset2 = "";
        }

        ipaSQL = ipadb.exec("SELECT " + accent + " FROM TaiLue where phone='" + onsets.join('') + "' ");
        if (ipaSQL.length > 0)
            ipatmp.onset = ipaSQL[0].values[0];
        else {
            ipaSQL = ipadb.exec("SELECT " + accent + " FROM TaiLue where phone='" + onsets[onsets.length - 1] + "' ");
            if (ipaSQL.length > 0)
                ipatmp.onset = ipaSQL[0].values[0];
            else {
                ipatmp.onset = "∅";
            }
            for (var j = (onsets.length - 2) ; j >= 0; j--) {
                ipaSQL = ipadb.exec("SELECT " + accent + " FROM TaiLue where phone='" + onsets[j] + "' ");
                if (ipaSQL.length > 0)
                    ipatmp.onset = ipaSQL[0].values[0] + minorsyllable + minortone + " " + ipatmp.onset;
                else {
                    ipatmp.onset = "∅";
                }
            }
        }
        if (ipatmp.onset2 != "") {
            ipaSQL = ipadb.exec("SELECT " + accent + " FROM TaiLue where phone='" + ipatmp.onset2 + "' ");
            if (ipaSQL.length > 0)
                ipatmp.onset += ipaSQL[0].values[0];
            else {
                ipastr = (" ∅") + ipastr;
                continue;
            }
        }
        if (ipatmp.rime == '◌')
            ipatmp.tone = 'ˀ';
        ipaSQL = ipadb.exec("SELECT " + accent + " FROM TaiLue where phone='" + ipatmp.rime + "' ");
        if (ipaSQL.length > 0)
            ipatmp.rime = ipaSQL[0].values[0];
        else {
            ipastr = (" ∅") + ipastr;
            continue;
        }
        ipaSQL = ipadb.exec("SELECT " + accent + " FROM TaiLue where phone='" + ipatmp.tone + ipatmp.toneclass + "' ");
        if (ipaSQL.length > 0)
            ipatmp.tone = ipaSQL[0].values[0];
        else {
            ipastr = (" ∅") + ipastr;
            continue;
        }
        
        if (accent == "roman") {
            ipatmp.onset = (ipatmp.onset + "").replace('`', '');
            ipastr = " " + ipatmp.onset.replace('ʔ','') + TaiYorimetone(ipatmp.rime[0], ipatmp.tone[0].replace('ˀ', '')) + ipastr;
        }
        else
            ipastr = " " + ipatmp.onset + ipatmp.rime + ipatmp.tone + ipastr;
    } */  

    return (ipastr.substring(1));
}

function TaiAitonIPA(w, accent) {
    var ipastr = "";
    var ipa = {};
	w = w.replace("်ြ","ြ်");
    ipa.onset = "", ipa.rime = "", ipa.tone = "", ipa.toneclass = 0;
    for (var i = 0; i < w.length; i++) {
        var c = w.charAt(i);
        if ("ြျၠကကျၵငꩡꩬယၺဒတထꩫလဗပၸမဝꩭဢ".includes(c)) {
            if (ipa.onset == "") {
                ipa.onset = c;
            }
			else {
				if ("ြျၠ".includes(c)) {
					ipa.onset += c;
                }
                else {
                    ipa.rime += c;
                }
            }
        }
		else if (c == "်") {
            ipa.rime += c;
			if ("ပတက".includes(w.charAt(i-1))) {
				ipa.tone = "50";				
			}
		}
        else if ("ႇႈးႉႛႋႊႌ".includes(c)) {
            if (ipa.tone == "") {
                ipa.tone = c;
            } else if ("ႈးႉႛႋ".includes(c)) {
                ipa.tone = "4" + c;
            } else if ("ႇႌ".includes(c)) {
                ipa.tone = "5" + c;
            }
        }
        else {
            ipa.rime += c;
        }
    }

    if (ipa.tone == "") {
        ipa.tone = "0";
    }
	
	if (ipa.onset == "") {
        ipa.onset = "0";
    }
	
	
	ipaSQL = ipadb.exec("SELECT " + accent + " FROM TaiAiton where phone='" + ipa.onset + "' ");
    if (ipaSQL.length > 0)
        ipa.onset = ipaSQL[0].values[0][0];
    else
        return "∅";
    ipaSQL = ipadb.exec("SELECT " + accent + " FROM TaiAiton where phone='" + ipa.rime + "' ");
    if (ipaSQL.length > 0)
        ipa.rime = ipaSQL[0].values[0][0];
    else
        return "∅";
    ipaSQL = ipadb.exec("SELECT " + accent + " FROM TaiAiton where phone='" + ipa.tone + "' ");
    if (ipaSQL.length > 0)
        ipa.tone = ipaSQL[0].values[0][0];
    else
        return "∅";

        if (accent == "roman") {
            /*
			-ipa.onset = ipa.onset.replace("̤", "");
            if ((ipa.onset == "k") && !ipa.rime.startsWith("i") && !ipa.rime.startsWith("e") && !ipa.rime.startsWith("ê")) {
                ipa.onset = ipa.onset.replace("k", "c").replace("g", "gh").replace("ng", "ngh");
            }
            if (ipa.rime.startsWith("i") || ipa.rime.startsWith("ơ") || ipa.rime.startsWith("ê") || ipa.rime.startsWith("â")) {
                ipa.onset = ipa.onset.replace("w", "u");
            } else {
                ipa.onset = ipa.onset.replace("w", "o");
            }
			*/
			ipastr = " " + ((ipa.onset == 'ʔ') ? '' : ipa.onset) + ipa.rime + ipa.tone.replace("ˀ","").replace("7","5");
        }
		else
			ipastr = " " + ipa.onset + ipa.rime + ipa.tone;
		
	/*
	while (ipalist.length != 0) {
        var ipatmp = ipalist.pop();
        var minortone = "";
        ipaSQL = ipadb.exec("SELECT " + accent + " FROM TaiLue where phone='ˀ" + ipatmp.toneclass + "' ");
        if (ipaSQL.length > 0)
            minortone = ipaSQL[0].values[0];
        var onsets = [ipatmp.onset];
        if (ipatmp.onset2.endsWith("1")) {
            onsets = onsets.concat(ipatmp.onset2.slice(0, -2).split(''));
            ipatmp.onset2 = ipatmp.onset2.slice(-2);
        }
        else {
            onsets = onsets.concat(ipatmp.onset2.split(''));
            ipatmp.onset2 = "";
        }

        ipaSQL = ipadb.exec("SELECT " + accent + " FROM TaiLue where phone='" + onsets.join('') + "' ");
        if (ipaSQL.length > 0)
            ipatmp.onset = ipaSQL[0].values[0];
        else {
            ipaSQL = ipadb.exec("SELECT " + accent + " FROM TaiLue where phone='" + onsets[onsets.length - 1] + "' ");
            if (ipaSQL.length > 0)
                ipatmp.onset = ipaSQL[0].values[0];
            else {
                ipatmp.onset = "∅";
            }
            for (var j = (onsets.length - 2) ; j >= 0; j--) {
                ipaSQL = ipadb.exec("SELECT " + accent + " FROM TaiLue where phone='" + onsets[j] + "' ");
                if (ipaSQL.length > 0)
                    ipatmp.onset = ipaSQL[0].values[0] + minorsyllable + minortone + " " + ipatmp.onset;
                else {
                    ipatmp.onset = "∅";
                }
            }
        }
        if (ipatmp.onset2 != "") {
            ipaSQL = ipadb.exec("SELECT " + accent + " FROM TaiLue where phone='" + ipatmp.onset2 + "' ");
            if (ipaSQL.length > 0)
                ipatmp.onset += ipaSQL[0].values[0];
            else {
                ipastr = (" ∅") + ipastr;
                continue;
            }
        }
        if (ipatmp.rime == '◌')
            ipatmp.tone = 'ˀ';
        ipaSQL = ipadb.exec("SELECT " + accent + " FROM TaiLue where phone='" + ipatmp.rime + "' ");
        if (ipaSQL.length > 0)
            ipatmp.rime = ipaSQL[0].values[0];
        else {
            ipastr = (" ∅") + ipastr;
            continue;
        }
        ipaSQL = ipadb.exec("SELECT " + accent + " FROM TaiLue where phone='" + ipatmp.tone + ipatmp.toneclass + "' ");
        if (ipaSQL.length > 0)
            ipatmp.tone = ipaSQL[0].values[0];
        else {
            ipastr = (" ∅") + ipastr;
            continue;
        }
        
        if (accent == "roman") {
            ipatmp.onset = (ipatmp.onset + "").replace('`', '');
            ipastr = " " + ipatmp.onset.replace('ʔ','') + TaiYorimetone(ipatmp.rime[0], ipatmp.tone[0].replace('ˀ', '')) + ipastr;
        }
        else
            ipastr = " " + ipatmp.onset + ipatmp.rime + ipatmp.tone + ipastr;
    } */  

    return (ipastr.substring(1));
}

function TaiLueIPA(w, accent) {
    var ipastr = "";
    var ipa = {};
    var tmpconso = "";
    ipa.onset = "", ipa.onset2 = "", ipa.rime = "", ipa.tone = "", ipa.toneclass = 0;
    var ipalist = [];
    w = w.replace('᧟', 'ᦶᦟᧁᧉ');
    w = w.replace('᧞', 'ᦶᦟᦰ');
    for (var i = 0; i < w.length; i++) {
        var c = w.charAt(i);
        if ("ᦀᦂᦃᦄᦈᦉᦊᦎᦏᦐᦔᦕᦖᦚᦛᦜᦡᦢᦠᦦᦧᦪᦁᦅᦆᦇᦋᦌᦍᦑᦒᦓᦗᦘᦙᦝᦞᦟᦤᦥᦣᦨᦩᦫ".includes(c)) {
            if (ipa.onset == "") {
                ipa.onset = c;
                ipa.rime += "◌";
                if ("ᦀᦂᦃᦄᦈᦉᦊᦎᦏᦐᦔᦕᦖᦚᦛᦜᦡᦢᦠᦦᦧᦪ".includes(c))
                    ipa.toneclass = 1;
                else if ("ᦁᦅᦆᦇᦋᦌᦍᦑᦒᦓᦗᦘᦙᦝᦞᦟᦤᦥᦣᦨᦩᦫ".includes(c))
                    ipa.toneclass = 2;
            }
            else {
                if (ipa.tone == "") {
                        ipa.tone = "0";
                }
                if (ipa.rime == "") {
                    ipa.rime = "◌";
                }
                tmpconso = "";
                ipalist.push(Object.assign({}, ipa));
                ipa.onset = "";
                ipa.onset2 = "";
                ipa.rime = "";
                ipa.tone = "";
                ipa.toneclass = 0;
                i--;
                continue;
            }
        }
        else if ("ᧅᧇᧆᦰ".includes(c)) {
            if ("◌ᦱ◌ᦴ◌ᦸᦶ◌".includes(ipa.rime)) {
                ipa.tone = "5";
            }
            else {
                ipa.tone = "4";
            }
            ipa.rime += c;
        }
        else if ("ᧂᧃᧄᧁ".includes(c)) {
                if (ipa.onset == "") {
                    ipa.onset = "∅";
                }
                ipa.rime += c;
        }
        else if ("ᧈᧉ".includes(c)) {
            if (ipa.tone == "") {
                ipa.tone = c;
            } else if (c == "ᧈ") {
                ipa.tone = "5";
                ipa.rime += c;
            }
        }
        else if ((ipa.rime != "") && ("ᦺᦵᦷᦶ".includes(c))) {
            if (ipa.tone == "") {
                ipa.tone = "0";
            }
            ipalist.push(Object.assign({}, ipa));
            ipa.onset = "";
            ipa.onset2 = "";
            ipa.rime = "";
            ipa.tone = "";
            ipa.toneclass = 0;
            i--;
            continue;
        }
        else {
            ipa.rime += c;
        }
    }

    if (ipa.tone == "") {
        ipa.tone = "0";
    }
    if (ipa.onset == "") {
        ipa.onset = "∅";
        if (ipalist.length == 0)
            ipalist.push(Object.assign({}, ipa));
    }
    else
        ipalist.push(Object.assign({}, ipa));

    var minorsyllable = "";
    ipaSQL = ipadb.exec("SELECT " + accent + " FROM TaiLue where phone='◌' ");
    if (ipaSQL.length > 0)
        minorsyllable = ipaSQL[0].values[0];

    while (ipalist.length != 0) {
        var ipatmp = ipalist.pop();
        var minortone = "";
        ipaSQL = ipadb.exec("SELECT " + accent + " FROM TaiLue where phone='ˀ" + ipatmp.toneclass + "' ");
        if (ipaSQL.length > 0)
            minortone = ipaSQL[0].values[0];
        var onsets = [ipatmp.onset];
        if (ipatmp.onset2.endsWith("1")) {
            onsets = onsets.concat(ipatmp.onset2.slice(0, -2).split(''));
            ipatmp.onset2 = ipatmp.onset2.slice(-2);
        }
        else {
            onsets = onsets.concat(ipatmp.onset2.split(''));
            ipatmp.onset2 = "";
        }

        ipaSQL = ipadb.exec("SELECT " + accent + " FROM TaiLue where phone='" + onsets.join('') + "' ");
        if (ipaSQL.length > 0)
            ipatmp.onset = ipaSQL[0].values[0];
        else {
            ipaSQL = ipadb.exec("SELECT " + accent + " FROM TaiLue where phone='" + onsets[onsets.length - 1] + "' ");
            if (ipaSQL.length > 0)
                ipatmp.onset = ipaSQL[0].values[0];
            else {
                ipatmp.onset = "∅";
            }
            for (var j = (onsets.length - 2) ; j >= 0; j--) {
                ipaSQL = ipadb.exec("SELECT " + accent + " FROM TaiLue where phone='" + onsets[j] + "' ");
                if (ipaSQL.length > 0)
                    ipatmp.onset = ipaSQL[0].values[0] + minorsyllable + minortone + " " + ipatmp.onset;
                else {
                    ipatmp.onset = "∅";
                }
            }
        }
        if (ipatmp.onset2 != "") {
            ipaSQL = ipadb.exec("SELECT " + accent + " FROM TaiLue where phone='" + ipatmp.onset2 + "' ");
            if (ipaSQL.length > 0)
                ipatmp.onset += ipaSQL[0].values[0];
            else {
                ipastr = (" ∅") + ipastr;
                continue;
            }
        }
        if (ipatmp.rime == '◌')
            ipatmp.tone = 'ˀ';
        ipaSQL = ipadb.exec("SELECT " + accent + " FROM TaiLue where phone='" + ipatmp.rime + "' ");
        if (ipaSQL.length > 0)
            ipatmp.rime = ipaSQL[0].values[0];
        else {
            ipastr = (" ∅") + ipastr;
            continue;
        }
        ipaSQL = ipadb.exec("SELECT " + accent + " FROM TaiLue where phone='" + ipatmp.tone + ipatmp.toneclass + "' ");
        if (ipaSQL.length > 0)
            ipatmp.tone = ipaSQL[0].values[0];
        else {
            ipastr = (" ∅") + ipastr;
            continue;
        }
        
        if (accent == "roman") {
            ipatmp.onset = (ipatmp.onset + "").replace('`', '');
            ipastr = " " + ipatmp.onset.replace('ʔ','') + TaiYorimetone(ipatmp.rime[0], ipatmp.tone[0].replace('ˀ', '')) + ipastr;
        }
        else
            ipastr = " " + ipatmp.onset + ipatmp.rime + ipatmp.tone + ipastr;
    }

    return (ipastr.substring(1));
}

function TaiDonIPA(w, accent) {
    var ipastr = "";
    var ipa = {};
    var tmpconso = "";
    ipa.onset = "", ipa.onset2 = "", ipa.rime = "", ipa.tone = "", ipa.toneclass = 0;
    var ipalist = [];
    w = w.replace('ꫛ', 'ꪇꪴꪙ');
    w = w.replace('ꫜ', 'ꪙꪳ꪿ꪉ');
    for (var i = 0; i < w.length; i++) {
        var c = w.charAt(i);
        if ("ꪀꪄꪂꪈꪬꪮꪊꪌꪐꪤꪒꪔꪖꪘꪎꪦꪨꪚꪜꪢꪠꪞꪪꪇꪆꪅꪃꪉꪭꪯꪋꪍꪑꪥꪓꪕꪗꪙꪏꪧꪩꪛꪝꪣꪟꪡꪫ".includes(c)) {
            if (ipa.onset == "") {
                ipa.onset = c;
                ipa.rime += "◌";
                if ("ꪀꪄꪂꪈꪬꪮꪊꪌꪐꪤꪒꪔꪖꪘꪎꪦꪨꪚꪜꪢꪠꪞꪪ".includes(c))
                    ipa.toneclass = 1;
                else if ("ꪇꪆꪅꪃꪉꪭꪯꪋꪍꪑꪥꪓꪕꪗꪙꪏꪧꪩꪛꪝꪣꪟꪡꪫ".includes(c))
                    ipa.toneclass = 2;
            }
            else if (((ipa.rime == "") || (ipa.rime.endsWith("◌"))) && (c != "ꪮ") && (!ipa.onset2.endsWith("1"))) {
                if (c == "ꪫ") {
                    c = "ꪫ1";
                }
                ipa.onset2 += c;
            }
            else {
                if ("ꪀꪒꪚ꫉".includes(c)) {
                    tmpconso = c;
                    if (c == "ꪀ") {
                        if (ipa.tone == "") {
                            ipa.tone = "ˀ";
                        }
                        else {
                            ipa.tone += "4";
                        }
                    } else if (ipa.tone == "") {
                        if ("◌ꪳ◌ꪷ◌ꪱ◌ꪮꪵ◌◌ꪸ◌ꪺ".includes(ipa.rime)) {
                            ipa.tone = "5";
                        }
                        else {
                            ipa.tone = "4";
                        }
                    }
                    ipa.rime += c;

                    ipalist.push(Object.assign({}, ipa));
                    ipa.onset = "";
                    ipa.onset2 = "";
                    ipa.rime = "";
                    ipa.tone = "";
                    ipa.toneclass = 0;
                    continue;
                }
                else if ("ꪥꪫꪉꪙꪣ".includes(c)) {
                    tmpconso = c;
                    if (ipa.tone == "") {
                        ipa.tone = "0";
                    }
                    if (ipa.onset == "") {
                        ipa.onset = "∅";
                    }
                    ipa.rime += c;
                    ipa.rime = ipa.rime.replace("̽", "");

                    ipalist.push(Object.assign({}, ipa));
                    ipa.onset = "";
                    ipa.onset2 = "";
                    ipa.rime = "";
                    ipa.tone = "";
                    ipa.toneclass = 0;
                    continue;
                }
                else if (c == "ꪮ") {
                    tmpconso = c;
                    ipa.rime += c;
                }
                else {
                    if (ipa.tone == "") {
                        ipa.tone = "0";
                        if ((ipa.onset2 != "") && ((ipa.rime == "ꪵ◌") || (ipa.rime == "ꪹ◌") || (ipa.rime == "ꪶ◌"))) {
                            var coda = ipa.onset2.slice(-1);
                            if (coda == "1") {
                                ipa.onset2 = ipa.onset2.slice(0, -1);
                                coda = ipa.onset2.slice(-1);
                            }
                            if ("ꪀꪒꪚ꫉".includes(coda)) {
                                if (coda == "ꪀ") {
                                    if (ipa.tone == "") {
                                        ipa.tone = "ˀ";
                                    }
                                    else {
                                        ipa.tone += "4";
                                    }
                                } else if (ipa.tone == "") {
                                    if ("◌ꪳ◌ꪷ◌ꪱ◌ꪮꪵ◌◌ꪸ◌ꪺ".includes(ipa.rime)) {
                                        ipa.tone = "5";
                                    }
                                    else {
                                        ipa.tone = "4";
                                    }
                                }
                                ipa.rime += coda;
                                ipa.onset2 = ipa.onset2.slice(0, -1);
                            }
                            else if ("ꪥꪫꪉꪙꪣ".includes(coda)) {
                                if (ipa.tone == "") {
                                    ipa.tone = "0";
                                }
                                if (ipa.onset == "") {
                                    ipa.onset = "∅";
                                }
                                ipa.rime += coda;
                                ipa.onset2 = ipa.onset2.slice(0, -1);
                            }
                            else if (coda == "ꪮ") {
                                ipa.rime += coda;
                                ipa.onset2 = ipa.onset2.slice(0, -1);
                            }
                            else {
                                ipa.tone = "0";
                            }
                        }
                    }
                    tmpconso = "";
                    ipa.rime = ipa.rime.replace("̽", "");
                    ipalist.push(Object.assign({}, ipa));
                    ipa.onset = "";
                    ipa.onset2 = "";
                    ipa.rime = "";
                    ipa.tone = "";
                    ipa.toneclass = 0;
                    i--;
                    continue;
                }
            }
        }
        else if ("꪿꫁".includes(c)) {
            ipa.tone = c;
            ipa.rime += "̽";
        }
        else if ((ipa.rime != "") && ("ꪵꪹꪶꪻꪼ".includes(c))) {
            if (ipa.tone == "") {
                ipa.tone = "0";
                if ((ipa.onset2 != "") && ((ipa.rime == "ꪵ◌") || (ipa.rime == "ꪹ◌") || (ipa.rime == "ꪶ◌"))) {
                    var coda = ipa.onset2.slice(-1);
                    if (coda == "1") {
                        ipa.onset2 = ipa.onset2.slice(0, -1);
                        coda = ipa.onset2.slice(-1);
                    }
                    if ("ꪀꪒꪚ꫉".includes(coda)) {
                        if (coda == "ꪀ") {
                            if (ipa.tone == "") {
                                ipa.tone = "ˀ";
                            }
                            else {
                                ipa.tone += "4";
                            }
                        } else if (ipa.tone == "") {
                            if ("◌ꪳ◌ꪷ◌ꪱ◌ꪮꪵ◌◌ꪸ◌ꪺ".includes(ipa.rime)) {
                                ipa.tone = "5";
                            }
                            else {
                                ipa.tone = "4";
                            }
                        }
                        ipa.rime += coda;
                        ipa.onset2 = ipa.onset2.slice(0, -1);
                    }
                    else if ("ꪥꪫꪉꪙꪣ".includes(coda)) {
                        if (ipa.tone == "") {
                            ipa.tone = "0";
                        }
                        if (ipa.onset == "") {
                            ipa.onset = "∅";
                        }
                        ipa.rime += coda;
                        ipa.onset2 = ipa.onset2.slice(0, -1);
                    }
                    else if (coda == "ꪮ") {
                        ipa.rime += coda;
                        ipa.onset2 = ipa.onset2.slice(0, -1);
                    }
                    else {
                        ipa.tone = "0";
                    }
                }
            }
            ipa.rime = ipa.rime.replace("̽", "");
            ipalist.push(Object.assign({}, ipa));
            ipa.onset = "";
            ipa.onset2 = "";
            ipa.rime = "";
            ipa.tone = "";
            ipa.toneclass = 0;
            i--;
            continue;
        }
        else {
            if ((ipa.onset == "") && (!"ꪵ◌ꪹ◌ꪶ◌ꪻ◌ꪼ◌".includes(c))) {
                if ("ꪀꪄꪂꪈꪬꪮꪊꪌꪐꪤꪒꪔꪖꪘꪎꪦꪨꪚꪜꪢꪠꪞꪪꪇꪆꪅꪃꪉꪭꪯꪋꪍꪑꪥꪓꪕꪗꪙꪏꪧꪩꪛꪝꪣꪟꪡꪫ".includes(tmpconso)) {
                    tmpconso = "";
                    var previpa = ipalist.pop();
                    previpa.rime = previpa.rime.slice(0, -1);
                    if ((previpa.tone == "ˀ") || (previpa.tone == "4") || (previpa.tone == "5"))
                        previpa.tone = "0";
                    else if (previpa.tone.endsWith("4")) {
                        previpa.tone = previpa.tone[0];
                    }
                    previpa.rime = previpa.rime.replace("̽", "");
                    ipalist.push(Object.assign({}, previpa));
                    ipa.onset = "";
                    ipa.onset2 = "";
                    ipa.rime = "";
                    ipa.tone = "";
                    ipa.toneclass = 0;
                    i -= 2;
                    continue;
                }
                else {
                    tmpconso = "";
                    ipa.onset = "∅";
                }
            }
            ipa.rime += c;
        }
    }

    if ((ipa.onset2 != "") && ((ipa.rime == "ꪵ◌") || (ipa.rime == "ꪹ◌") || (ipa.rime == "ꪶ◌"))) {
        var coda = ipa.onset2.slice(-1);
        if (coda == "1") {
            ipa.onset2 = ipa.onset2.slice(0, -1);
            coda = ipa.onset2.slice(-1);
        }
        if ("ꪀꪒꪚ꫉".includes(coda)) {
            if (coda == "ꪀ") {
                if (ipa.tone == "") {
                    ipa.tone = "ˀ";
                }
                else {
                    ipa.tone += "4";
                }
            } else if (ipa.tone == "") {
                if ("◌ꪳ◌ꪷ◌ꪱ◌ꪮꪵ◌◌ꪸ◌ꪺ".includes(ipa.rime)) {
                    ipa.tone = "5";
                }
                else {
                    ipa.tone = "4";
                }
            }
            ipa.rime += coda;
            ipa.onset2 = ipa.onset2.slice(0, -1);
        }
        else if ("ꪥꪫꪉꪙꪣ".includes(coda)) {
            if (ipa.tone == "") {
                ipa.tone = "0";
            }
            if (ipa.onset == "") {
                ipa.onset = "∅";
            }
            ipa.rime += coda;
            ipa.onset2 = ipa.onset2.slice(0, -1);
        }
        else if (coda == "ꪥꪫꪉꪙꪣ") {
            ipa.rime += coda;
            ipa.onset2 = ipa.onset2.slice(0, -1);
        }
        else {
            ipa.tone = "0";
        }
    }
    ipa.rime = ipa.rime.replace("̽", "");
    if (ipa.tone == "") {
        ipa.tone = "0";
    }
    if (ipa.onset == "") {
        ipa.onset = "∅";
        if (ipalist.length == 0)
            ipalist.push(Object.assign({}, ipa));
    }
    else
        ipalist.push(Object.assign({}, ipa));

    var minorsyllable = "";
    ipaSQL = ipadb.exec("SELECT " + accent + " FROM TaiDon where phone='◌' ");
    if (ipaSQL.length > 0)
        minorsyllable = ipaSQL[0].values[0][0];

    while (ipalist.length != 0) {
        var ipatmp = ipalist.pop();
        var minortone = "";
        ipaSQL = ipadb.exec("SELECT " + accent + " FROM TaiDon where phone='ˀ" + ipatmp.toneclass + "' ");
        if (ipaSQL.length > 0)
            minortone = ipaSQL[0].values[0][0];
        var onsets = [ipatmp.onset];
        if (ipatmp.onset2.endsWith("1")) {
            onsets = onsets.concat(ipatmp.onset2.slice(0, -2).split(''));
            ipatmp.onset2 = ipatmp.onset2.slice(-2);
        }
        else {
            onsets = onsets.concat(ipatmp.onset2.split(''));
            ipatmp.onset2 = "";
        }

        ipaSQL = ipadb.exec("SELECT " + accent + " FROM TaiDon where phone='" + onsets.join('') + "' ");
        if (ipaSQL.length > 0)
            ipatmp.onset = ipaSQL[0].values[0][0];
        else {
            ipaSQL = ipadb.exec("SELECT " + accent + " FROM TaiDon where phone='" + onsets[onsets.length - 1] + "' ");
            if (ipaSQL.length > 0)
                ipatmp.onset = ipaSQL[0].values[0][0];
            else {
                ipatmp.onset = "∅";
            }
            for (var j = (onsets.length - 2) ; j >= 0; j--) {
                ipaSQL = ipadb.exec("SELECT " + accent + " FROM TaiDon where phone='" + onsets[j] + "' ");
                if (ipaSQL.length > 0)
                    ipatmp.onset = ipaSQL[0].values[0][0] + minorsyllable + minortone + " " + ipatmp.onset;
                else {
                    ipatmp.onset = "∅";
                }
            }
        }
        if (ipatmp.onset2 != "") {
            ipaSQL = ipadb.exec("SELECT " + accent + " FROM TaiDon where phone='" + ipatmp.onset2 + "' ");
            if (ipaSQL.length > 0)
                ipatmp.onset += ipaSQL[0].values[0][0];
            else {
                ipastr = (" ∅") + ipastr;
                continue;
            }
        }
        if (ipatmp.rime == '◌')
            ipatmp.tone = 'ˀ';
        ipaSQL = ipadb.exec("SELECT " + accent + " FROM TaiDon where phone='" + ipatmp.rime + "' ");
        if (ipaSQL.length > 0)
            ipatmp.rime = ipaSQL[0].values[0][0];
        else {
            ipastr = (" ∅") + ipastr;
            continue;
        }
        ipatmp.tone = ipatmp.tone.replace("꪿4", "4").replace("꫁4", "4");
        ipaSQL = ipadb.exec("SELECT " + accent + " FROM TaiDon where phone='" + ipatmp.tone + ipatmp.toneclass + "' ");
        if (ipaSQL.length > 0)
            ipatmp.tone = ipaSQL[0].values[0][0];
        else {
            ipastr = (" ∅") + ipastr;
            continue;
        }

        if (accent == "roman") {
            ipatmp.onset = ipatmp.onset.replace('`', '');
            ipatmp.rime = ipatmp.rime.replace('`', '');
            ipatmp.onset = ipatmp.onset.replace("kw", "qu");
            if (ipatmp.onset == "∅") {
                ipastr = (" ∅") + ipastr;
                continue;
            }
            if ((ipatmp.onset == "k") && !ipatmp.rime.startsWith("i") && !ipatmp.rime.startsWith("e") && !ipatmp.rime.startsWith("ê")) {
                ipatmp.onset = ipatmp.onset.replace("k", "c").replace("g", "gh").replace("ng", "ngh");
            }
			if (ipatmp.rime.startsWith("i") && (ipatmp.onset.endsWith("w") || ipatmp.onset.endsWith("qu"))) {
                ipatmp.onset = ipatmp.onset.replace("w", "u");
                ipatmp.rime = ipatmp.rime.replace("i", "y");
            }
            else if (ipatmp.rime.startsWith("ơ") || ipatmp.rime.startsWith("ê") || ipatmp.rime.startsWith("â") || ipatmp.rime.startsWith("y")) {
                ipatmp.onset = ipatmp.onset.replace("w", "u");
            } else {
                ipatmp.onset = ipatmp.onset.replace("w", "o");
            }
            if ((ipatmp.tone == "́4") && (!ipatmp.rime.endsWith("c"))) {
                ipatmp.tone = "";
            }
            ipastr = " " + ipatmp.onset.replace('ʔ','') + TaiYorimetone(ipatmp.rime, ipatmp.tone.replace('ˀ', '').replace('0', '').replace('4', '').replace('5', '')) + ipastr;
        }
        else
            ipastr = " " + ipatmp.onset + ipatmp.rime + ipatmp.tone + ipastr;
    }

    return (ipastr.substring(1));
}

function TaiKhaoIPA(w, accent) {
    var ipastr = "";
    var ipa = {};
    var tmpconso = "";
    ipa.onset = "", ipa.onset2 = "", ipa.rime = "", ipa.tone = "", ipa.toneclass = 0;
    var ipalist = [];
    w = w.replace('ꫛ', 'ꪶꪇꪙ');
    w = w.replace('ꫜ', 'ꪙꪳ꪿ꪉ');
    for (var i = 0; i < w.length; i++) {
        var c = w.charAt(i);
        if ("ꪀꪄꪂꪈꪬꪮꪊꪌꪐꪤꪒꪔꪖꪘꪎꪦꪨꪚꪜꪢꪠꪞꪪꪁꪇꪅꪃꪉꪭꪯꪋꪍꪑꪥꪓꪕꪗꪙꪏꪧꪩꪛꪝꪣꪟꪡꪫ".includes(c)) {
            if (ipa.onset == "") {
                ipa.onset = c;
                ipa.rime += "◌";
                if ("ꪀꪄꪂꪈꪬꪮꪊꪌꪐꪤꪒꪔꪖꪘꪎꪦꪨꪚꪜꪢꪠꪞꪪ".includes(c))
                    ipa.toneclass = 1;
                else if ("ꪁꪇꪅꪃꪉꪭꪯꪋꪍꪑꪥꪓꪕꪗꪙꪏꪧꪩꪛꪝꪣꪟꪡꪫ".includes(c))
                    ipa.toneclass = 2;
            }
            else if (((ipa.rime == "") || (ipa.rime.endsWith("◌"))) && (c != "ꪮ") && (!ipa.onset2.endsWith("1"))) {
                if (c == "ꪫ") {
                    c = "ꪫ1";
                }
                ipa.onset2 += c;
            }
            else {
                if ("ꪀꪒꪚ".includes(c)) {
                    tmpconso = c;
                    if (ipa.tone == "") {
                        ipa.tone = "5";
                    }
                    ipa.rime += c;

                    ipalist.push(Object.assign({}, ipa));
                    ipa.onset = "";
                    ipa.onset2 = "";
                    ipa.rime = "";
                    ipa.tone = "";
                    ipa.toneclass = 0;
                    continue;
                }
                else if ("ꪥꪫꪉꪙꪣ".includes(c)) {
                    tmpconso = c;
                    if (ipa.tone == "") {
                        ipa.tone = "0";
                    }
                    if (ipa.onset == "") {
                        ipa.onset = "∅";
                    }
                    ipa.rime += c;
                    ipa.rime = ipa.rime.replace("̽", "");

                    ipalist.push(Object.assign({}, ipa));
                    ipa.onset = "";
                    ipa.onset2 = "";
                    ipa.rime = "";
                    ipa.tone = "";
                    ipa.toneclass = 0;
                    continue;
                }
                else if (c == "ꪮ") {
                    tmpconso = c;
                    ipa.rime += c;
                }
                else {
                    if (ipa.tone == "") {
                        ipa.tone = "0";
                        if ((ipa.onset2 != "") && ((ipa.rime == "ꪵ◌") || (ipa.rime == "ꪹ◌") || (ipa.rime == "ꪶ◌") || (ipa.rime == "ꪻ◌"))) {
                            var coda = ipa.onset2.slice(-1);
                            if (coda == "1") {
                                ipa.onset2 = ipa.onset2.slice(0, -1);
                                coda = ipa.onset2.slice(-1);
                            }
                            if ("ꪀꪒꪚ".includes(coda)) {
                                if (ipa.tone == "") {
									ipa.tone = "5";
								}
                                ipa.rime += coda;
                                ipa.onset2 = ipa.onset2.slice(0, -1);
                            }
                            else if ("ꪥꪫꪉꪙꪣ".includes(coda)) {
                                if (ipa.tone == "") {
                                    ipa.tone = "0";
                                }
                                if (ipa.onset == "") {
                                    ipa.onset = "∅";
                                }
                                ipa.rime += coda;
                                ipa.onset2 = ipa.onset2.slice(0, -1);
                            }
                            else if (coda == "ꪮ") {
                                ipa.rime += coda;
                                ipa.onset2 = ipa.onset2.slice(0, -1);
                            }
                            else {
                                ipa.tone = "0";
                            }
                        }
                    }
                    tmpconso = "";
                    ipa.rime = ipa.rime.replace("̽", "");
                    ipalist.push(Object.assign({}, ipa));
                    ipa.onset = "";
                    ipa.onset2 = "";
                    ipa.rime = "";
                    ipa.tone = "";
                    ipa.toneclass = 0;
                    i--;
                    continue;
                }
            }
        }
        else if ("꪿꫁".includes(c)) {
            ipa.tone = c;
            ipa.rime += "̽";
        }
        else if ((ipa.rime != "") && ("ꪵꪹꪶꪻꪼ".includes(c))) {
            if (ipa.tone == "") {
                ipa.tone = "0";
                if ((ipa.onset2 != "") && ((ipa.rime == "ꪵ◌") || (ipa.rime == "ꪹ◌") || (ipa.rime == "ꪶ◌") || (ipa.rime == "ꪻ◌"))) {
                    var coda = ipa.onset2.slice(-1);
                    if (coda == "1") {
                        ipa.onset2 = ipa.onset2.slice(0, -1);
                        coda = ipa.onset2.slice(-1);
                    }
                    if ("ꪀꪒꪚ".includes(coda)) {
                        if (ipa.tone == "") {
							ipa.tone = "5";
						}
                        ipa.rime += coda;
                        ipa.onset2 = ipa.onset2.slice(0, -1);
                    }
                    else if ("ꪥꪫꪉꪙꪣ".includes(coda)) {
                        if (ipa.tone == "") {
                            ipa.tone = "0";
                        }
                        if (ipa.onset == "") {
                            ipa.onset = "∅";
                        }
                        ipa.rime += coda;
                        ipa.onset2 = ipa.onset2.slice(0, -1);
                    }
                    else if (coda == "ꪮ") {
                        ipa.rime += coda;
                        ipa.onset2 = ipa.onset2.slice(0, -1);
                    }
                    else {
                        ipa.tone = "0";
                    }
                }
            }
            ipa.rime = ipa.rime.replace("̽", "");
            ipalist.push(Object.assign({}, ipa));
            ipa.onset = "";
            ipa.onset2 = "";
            ipa.rime = "";
            ipa.tone = "";
            ipa.toneclass = 0;
            i--;
            continue;
        }
        else {
            if ((ipa.onset == "") && (!"ꪵ◌ꪹ◌ꪶ◌ꪻ◌ꪼ◌".includes(c))) {
                if ("ꪀꪄꪂꪈꪬꪮꪊꪌꪐꪤꪒꪔꪖꪘꪎꪦꪨꪚꪜꪢꪠꪞꪪꪁꪇꪅꪃꪉꪭꪯꪋꪍꪑꪥꪓꪕꪗꪙꪏꪧꪩꪛꪝꪣꪟꪡꪫ".includes(tmpconso)) {
                    tmpconso = "";
                    var previpa = ipalist.pop();
                    previpa.rime = previpa.rime.slice(0, -1);
                    if ((previpa.tone == "ˀ") || (previpa.tone == "4") || (previpa.tone == "5"))
                        previpa.tone = "0";
                    else if (previpa.tone.endsWith("4")) {
                        previpa.tone = previpa.tone[0];
                    }
                    previpa.rime = previpa.rime.replace("̽", "");
                    ipalist.push(Object.assign({}, previpa));
                    ipa.onset = "";
                    ipa.onset2 = "";
                    ipa.rime = "";
                    ipa.tone = "";
                    ipa.toneclass = 0;
                    i -= 2;
                    continue;
                }
                else {
                    tmpconso = "";
                    ipa.onset = "∅";
                }
            }
            ipa.rime += c;
        }
    }

    if ((ipa.onset2 != "") && ((ipa.rime == "ꪵ◌") || (ipa.rime == "ꪹ◌") || (ipa.rime == "ꪶ◌") || (ipa.rime == "ꪻ◌"))) {
        var coda = ipa.onset2.slice(-1);
        if (coda == "1") {
            ipa.onset2 = ipa.onset2.slice(0, -1);
            coda = ipa.onset2.slice(-1);
        }
        if ("ꪀꪒꪚ".includes(coda)) {
            if (ipa.tone == "") {
                ipa.tone = "5";
            }
            ipa.rime += coda;
            ipa.onset2 = ipa.onset2.slice(0, -1);
        }
        else if ("ꪥꪫꪉꪙꪣ".includes(coda)) {
            if (ipa.tone == "") {
                ipa.tone = "0";
            }
            if (ipa.onset == "") {
                ipa.onset = "∅";
            }
            ipa.rime += coda;
            ipa.onset2 = ipa.onset2.slice(0, -1);
        }
        else if (coda == "ꪥꪫꪉꪙꪣ") {
            ipa.rime += coda;
            ipa.onset2 = ipa.onset2.slice(0, -1);
        }
        else {
            ipa.tone = "0";
        }
    }
    ipa.rime = ipa.rime.replace("̽", "");
    if (ipa.tone == "") {
        ipa.tone = "0";
    }
    if (ipa.onset == "") {
        ipa.onset = "∅";
        if (ipalist.length == 0)
            ipalist.push(Object.assign({}, ipa));
    }
    else
        ipalist.push(Object.assign({}, ipa));

    var minorsyllable = "";
    ipaSQL = ipadb.exec("SELECT " + accent + " FROM TaiKhao where phone='◌' ");
    if (ipaSQL.length > 0)
        minorsyllable = ipaSQL[0].values[0][0];

    while (ipalist.length != 0) {
        var ipatmp = ipalist.pop();
        var minortone = "";
        ipaSQL = ipadb.exec("SELECT " + accent + " FROM TaiKhao where phone='ˀ" + ipatmp.toneclass + "' ");
        if (ipaSQL.length > 0)
            minortone = ipaSQL[0].values[0][0];
        var onsets = [ipatmp.onset];
        if (ipatmp.onset2.endsWith("1")) {
            onsets = onsets.concat(ipatmp.onset2.slice(0, -2).split(''));
            ipatmp.onset2 = ipatmp.onset2.slice(-2);
        }
        else {
            onsets = onsets.concat(ipatmp.onset2.split(''));
            ipatmp.onset2 = "";
        }

        ipaSQL = ipadb.exec("SELECT " + accent + " FROM TaiKhao where phone='" + onsets.join('') + "' ");
        if (ipaSQL.length > 0)
            ipatmp.onset = ipaSQL[0].values[0][0];
        else {
            ipaSQL = ipadb.exec("SELECT " + accent + " FROM TaiKhao where phone='" + onsets[onsets.length - 1] + "' ");
            if (ipaSQL.length > 0)
                ipatmp.onset = ipaSQL[0].values[0][0];
            else {
                ipatmp.onset = "∅";
            }
            for (var j = (onsets.length - 2) ; j >= 0; j--) {
                ipaSQL = ipadb.exec("SELECT " + accent + " FROM TaiKhao where phone='" + onsets[j] + "' ");
                if (ipaSQL.length > 0)
                    ipatmp.onset = ipaSQL[0].values[0][0] + minorsyllable + minortone + " " + ipatmp.onset;
                else {
                    ipatmp.onset = "∅";
                }
            }
        }
        if (ipatmp.onset2 != "") {
            ipaSQL = ipadb.exec("SELECT " + accent + " FROM TaiKhao where phone='" + ipatmp.onset2 + "' ");
            if (ipaSQL.length > 0)
                ipatmp.onset += ipaSQL[0].values[0][0];
            else {
                ipastr = (" ∅") + ipastr;
                continue;
            }
        }
        if (ipatmp.rime == '◌')
            ipatmp.tone = 'ˀ';
        ipaSQL = ipadb.exec("SELECT " + accent + " FROM TaiKhao where phone='" + ipatmp.rime + "' ");
        if (ipaSQL.length > 0)
            ipatmp.rime = ipaSQL[0].values[0][0];
        else {
            ipastr = (" ∅") + ipastr;
            continue;
        }
        ipatmp.tone = ipatmp.tone.replace("꪿4", "4").replace("꫁4", "4");
        ipaSQL = ipadb.exec("SELECT " + accent + " FROM TaiKhao where phone='" + ipatmp.tone + ipatmp.toneclass + "' ");
        if (ipaSQL.length > 0)
            ipatmp.tone = ipaSQL[0].values[0][0];
        else {
            ipastr = (" ∅") + ipastr;
            continue;
        }

        if (accent == "roman") {
            ipatmp.onset = ipatmp.onset.replace('`', '');
            ipatmp.rime = ipatmp.rime.replace('`', '');
            ipatmp.onset = ipatmp.onset.replace("kw", "qu");
            if (ipatmp.onset == "∅") {
                ipastr = (" ∅") + ipastr;
                continue;
            }
            if ((ipatmp.onset == "k") && !ipatmp.rime.startsWith("i") && !ipatmp.rime.startsWith("e") && !ipatmp.rime.startsWith("ê")) {
                ipatmp.onset = ipatmp.onset.replace("k", "c").replace("g", "gh").replace("ng", "ngh");
            }
			if (ipatmp.rime.startsWith("i") && (ipatmp.onset.endsWith("w") || ipatmp.onset.endsWith("qu"))) {
                ipatmp.onset = ipatmp.onset.replace("w", "u");
                ipatmp.rime = ipatmp.rime.replace("i", "y");
            }
            else if (ipatmp.rime.startsWith("ơ") || ipatmp.rime.startsWith("ê") || ipatmp.rime.startsWith("â") || ipatmp.rime.startsWith("y")) {
                ipatmp.onset = ipatmp.onset.replace("w", "u");
            } else {
                ipatmp.onset = ipatmp.onset.replace("w", "o");
            }
            if ((ipatmp.tone == "́4") && (!ipatmp.rime.endsWith("c"))) {
                ipatmp.tone = "";
            }
            ipastr = " " + ipatmp.onset.replace('ʔ','') + TaiYorimetone(ipatmp.rime, ipatmp.tone.replace('ˀ', '').replace('0', '').replace('4', '').replace('5', '')) + ipastr;
        }
        else
            ipastr = " " + ipatmp.onset + ipatmp.rime + ipatmp.tone + ipastr;
    }

    return (ipastr.substring(1));
}

function TaiDaengIPA(w, accent) {
    var ipastr = "";
    var ipa = {};
    var tmpconso = "";
    ipa.onset = "", ipa.onset2 = "", ipa.rime = "", ipa.tone = "", ipa.toneclass = 0;
    var ipalist = [];
    w = w.replace('ꫛ', 'ꪶꪁꪙ');
    for (var i = 0; i < w.length; i++) {
        var c = w.charAt(i);
        if ("ꪀꪄꪈꪬꪮꪊꪐꪦꪒꪔꪖꪘꪎꪨꪚꪜꪢꪞꪠꪪꪇꪅꪉꪭꪯꪋꪑꪥꪓꪕꪗꪙꪏꪩꪛꪝꪣꪡꪟꪫ".includes(c)) {
            if (ipa.onset == "") {
                ipa.onset = c;
                ipa.rime += "◌";
                if ("ꪀꪄꪈꪬꪮꪊꪐꪦꪒꪔꪖꪘꪎꪨꪚꪜꪢꪞꪠꪪ".includes(c))
                    ipa.toneclass = 1;
                else if ("ꪇꪅꪉꪭꪯꪋꪑꪥꪓꪕꪗꪙꪏꪩꪛꪝꪣꪡꪟꪫ".includes(c))
                    ipa.toneclass = 2;
            }
            else if (((ipa.rime == "") || (ipa.rime.endsWith("◌"))) && (c != "ꪮ") && (!ipa.onset2.endsWith("1"))) {
                if (c == "ꪫ") {
                    c = "ꪫ1";
                }
                ipa.onset2 += c;
            }
            else {
                if ("ꪀꪒꪚ".includes(c)) {
                    tmpconso = c;
                    if (ipa.tone == "") {
                        if (["◌ꪳꪳ","◌ꪲꪲ","◌ꪴꪴ","◌ꪱ","◌ꪮ","ꪵ◌","ꪻ◌","◌ꪸ","◌ꪺ","ꪹ◌ꪰ"].includes(ipa.rime)) {
                            ipa.tone = "5";
                        }
                        else {
                            ipa.tone = "4";
                        }
                    }
                    ipa.rime += c;

                    ipalist.push(Object.assign({}, ipa));
                    ipa.onset = "";
                    ipa.onset2 = "";
                    ipa.rime = "";
                    ipa.tone = "";
                    ipa.toneclass = 0;
                    continue;
                }
                else if ("ꪥꪫꪉꪙꪣ".includes(c)) {
                    tmpconso = c;
                    if (ipa.tone == "") {
                        ipa.tone = "0";
                    }
                    if (ipa.onset == "") {
                        ipa.onset = "∅";
                    }
                    ipa.rime += c;
                    ipa.rime = ipa.rime.replace("̽", "");

                    ipalist.push(Object.assign({}, ipa));
                    ipa.onset = "";
                    ipa.onset2 = "";
                    ipa.rime = "";
                    ipa.tone = "";
                    ipa.toneclass = 0;
                    continue;
                }
                else if (c == "ꪮ") {
                    tmpconso = c;
                    ipa.rime += c;
                }
                else {
                    if (ipa.tone == "") {
                        ipa.tone = "0";
                        if ((ipa.onset2 != "") && ((ipa.rime == "ꪵ◌") || (ipa.rime == "ꪹ◌") || (ipa.rime == "ꪶ◌") || (ipa.rime == "ꪻ◌"))) {
                            var coda = ipa.onset2.slice(-1);
                            if (coda == "1") {
                                ipa.onset2 = ipa.onset2.slice(0, -1);
                                coda = ipa.onset2.slice(-1);
                            }
                            if ("ꪀꪒꪚ".includes(coda)) {
                                    if (["◌ꪳꪳ","◌ꪲꪲ","◌ꪴꪴ","◌ꪱ","◌ꪮ","ꪵ◌","ꪻ◌","◌ꪸ","◌ꪺ","ꪹ◌ꪰ"].includes(ipa.rime)) {
                                        ipa.tone = "5";
                                    }
                                    else {
                                        ipa.tone = "4";
                                    }
                                ipa.rime += coda;
                                ipa.onset2 = ipa.onset2.slice(0, -1);
                            }
							else if ("ꪥꪫꪉꪙꪣ".includes(coda)) {
                                if (ipa.tone == "") {
                                    ipa.tone = "0";
                                }
                                if (ipa.onset == "") {
                                    ipa.onset = "∅";
                                }
                                ipa.rime += coda;
								ipa.onset2 = ipa.onset2.slice(0, -1);
                            }
                            else if (coda == "ꪮ") {
                                ipa.rime += coda;
                                ipa.onset2 = ipa.onset2.slice(0, -1);
                            }
                            else {
                                ipa.tone = "0";
                            }
                        }
                    }
                    tmpconso = "";
                    ipa.rime = ipa.rime.replace("̽", "");
                    ipalist.push(Object.assign({}, ipa));
                    ipa.onset = "";
                    ipa.onset2 = "";
                    ipa.rime = "";
                    ipa.tone = "";
                    ipa.toneclass = 0;
                    i--;
                    continue;
                }
            }
        }
        else if ("꪿꫁".includes(c)) {
            ipa.tone = c;
            ipa.rime += "̽";
        }
        else if ((ipa.rime != "") && ("ꪵꪹꪶꪻꪼ".includes(c))) {
            if (ipa.tone == "") {
                ipa.tone = "0";
                if ((ipa.onset2 != "") && ((ipa.rime == "ꪵ◌") || (ipa.rime == "ꪹ◌") || (ipa.rime == "ꪶ◌") || (ipa.rime == "ꪻ◌"))) {
                    var coda = ipa.onset2.slice(-1);
                            if (coda == "1") {
                                ipa.onset2 = ipa.onset2.slice(0, -1);
                                coda = ipa.onset2.slice(-1);
                            }
                    
                            if ("ꪀꪒꪚ".includes(coda)) {
                                    if (["◌ꪳꪳ","◌ꪲꪲ","◌ꪴꪴ","◌ꪱ","◌ꪮ","ꪵ◌","ꪻ◌","◌ꪸ","◌ꪺ","ꪹ◌ꪰ"].includes(ipa.rime)) {
                                        ipa.tone = "5";
                                    }
                                    else {
                                        ipa.tone = "4";
                                    }
                                ipa.rime += coda;
                                ipa.onset2 = ipa.onset2.slice(0, -1);
                            }                    
							else if ("ꪥꪫꪉꪙꪣ".includes(coda)) {
                                if (ipa.tone == "") {
                                    ipa.tone = "0";
                                }
                                if (ipa.onset == "") {
                                    ipa.onset = "∅";
                                }
                                ipa.rime += coda;
								ipa.onset2 = ipa.onset2.slice(0, -1);
                            }
                            else if (coda == "ꪮ") {
                                ipa.rime += coda;
                                ipa.onset2 = ipa.onset2.slice(0, -1);
                            }
                            else {
                                ipa.tone = "0";
                            }
                }
            }
            ipa.rime = ipa.rime.replace("̽", "");
            ipalist.push(Object.assign({}, ipa));
            ipa.onset = "";
            ipa.onset2 = "";
            ipa.rime = "";
            ipa.tone = "";
            ipa.toneclass = 0;
            i--;
            continue;
        }
        else {
            if ((ipa.onset == "") && (!"ꪵ◌ꪹ◌ꪶ◌ꪻ◌ꪼ◌".includes(c))) {
                if ("ꪀꪄꪈꪬꪮꪊꪐꪦꪒꪔꪖꪘꪎꪨꪚꪜꪢꪞꪠꪪꪇꪅꪉꪭꪯꪋꪑꪥꪓꪕꪗꪙꪏꪩꪛꪝꪣꪡꪟꪫ".includes(tmpconso)) {
                    tmpconso = "";
                    var previpa = ipalist.pop();
                    previpa.rime = previpa.rime.slice(0, -1);
                    if ((previpa.tone == "4") || (previpa.tone == "5"))
                        previpa.tone = "0";
                    else if (previpa.tone.endsWith("4")) {
                        previpa.tone = previpa.tone[0];
                    }
                    previpa.rime = previpa.rime.replace("̽", "");
                    ipalist.push(Object.assign({}, previpa));
                    ipa.onset = "";
                    ipa.onset2 = "";
                    ipa.rime = "";
                    ipa.tone = "";
                    ipa.toneclass = 0;
                    i -= 2;
                    continue;
                }
                else {
                    tmpconso = "";
                    ipa.onset = "∅";
                }
            }
            ipa.rime += c;
        }
    }

    if ((ipa.onset2 != "") && ((ipa.rime == "ꪵ◌") || (ipa.rime == "ꪹ◌") || (ipa.rime == "ꪶ◌")|| (ipa.rime == "ꪻ◌"))) {
        var coda = ipa.onset2.slice(-1);
                            if (coda == "1") {
                                ipa.onset2 = ipa.onset2.slice(0, -1);
                                coda = ipa.onset2.slice(-1);
                            }
                    
                            if ("ꪀꪒꪚ".includes(coda)) {
                                    if (["◌ꪳꪳ","◌ꪲꪲ","◌ꪴꪴ","◌ꪱ","◌ꪮ","ꪵ◌","ꪻ◌","◌ꪸ","◌ꪺ","ꪹ◌ꪰ"].includes(ipa.rime)) {
                                        ipa.tone = "5";
                                    }
                                    else {
                                        ipa.tone = "4";
                                    }
                                ipa.rime += coda;
                                ipa.onset2 = ipa.onset2.slice(0, -1);
                            }                    
							else if ("ꪥꪫꪉꪙꪣ".includes(coda)) {
                                if (ipa.tone == "") {
                                    ipa.tone = "0";
                                }
                                if (ipa.onset == "") {
                                    ipa.onset = "∅";
                                }
                                ipa.rime += coda;
								ipa.onset2 = ipa.onset2.slice(0, -1);
                            }
                            else if (coda == "ꪮ") {
                                ipa.rime += coda;
                                ipa.onset2 = ipa.onset2.slice(0, -1);
                            }
                            else {
                                ipa.tone = "0";
                            }
    }
    ipa.rime = ipa.rime.replace("̽", "");
    if (ipa.tone == "") {
        ipa.tone = "0";
    }
    if (ipa.onset == "") {
        ipa.onset = "∅";
        if (ipalist.length == 0)
            ipalist.push(Object.assign({}, ipa));
    }
    else
        ipalist.push(Object.assign({}, ipa));

    var minorsyllable = "";
    ipaSQL = ipadb.exec("SELECT " + accent + " FROM TaiDaeng where phone='◌' ");
    if (ipaSQL.length > 0)
        minorsyllable = ipaSQL[0].values[0][0];

    while (ipalist.length != 0) {
        var ipatmp = ipalist.pop();
        var minortone = "";
		
		if (ipatmp.onset2=="ꪫ1") {
			if (ipatmp.rime.startsWith("ꪶ◌")) {
				ipatmp.rime = ipatmp.rime.replace("ꪶ◌","ꪶ◌ꪫ");
				ipatmp.onset2="";
			}
			if (ipatmp.rime.startsWith("◌ꪴ")) {
				ipatmp.rime = ipatmp.rime.replace("◌ꪴ","◌ꪫꪴ");
				ipatmp.onset2="";
			}
		}
		
        ipaSQL = ipadb.exec("SELECT " + accent + " FROM TaiDaeng where phone='ˀ" + ipatmp.toneclass + "' ");
        if (ipaSQL.length > 0)
            minortone = ipaSQL[0].values[0][0];
        var onsets = [ipatmp.onset];
        if (ipatmp.onset2.endsWith("1")) {
            onsets = onsets.concat(ipatmp.onset2.slice(0, -2).split(''));
            ipatmp.onset2 = ipatmp.onset2.slice(-2);
        }
        else {
            onsets = onsets.concat(ipatmp.onset2.split(''));
            ipatmp.onset2 = "";
        }

        ipaSQL = ipadb.exec("SELECT " + accent + " FROM TaiDaeng where phone='" + onsets.join('') + "' ");
        if (ipaSQL.length > 0)
            ipatmp.onset = ipaSQL[0].values[0][0];
        else {
            ipaSQL = ipadb.exec("SELECT " + accent + " FROM TaiDaeng where phone='" + onsets[onsets.length - 1] + "' ");
            if (ipaSQL.length > 0)
                ipatmp.onset = ipaSQL[0].values[0][0];
            else {
                ipatmp.onset = "∅";
            }
            for (var j = (onsets.length - 2); j >= 0; j--) {
                ipaSQL = ipadb.exec("SELECT " + accent + " FROM TaiDaeng where phone='" + onsets[j] + "' ");
                if (ipaSQL.length > 0)
                    ipatmp.onset = ipaSQL[0].values[0][0] + minorsyllable + minortone + " " + ipatmp.onset;
                else {
                    ipatmp.onset = "∅";
                }
            }
        }
        if (ipatmp.onset2 != "") {
            ipaSQL = ipadb.exec("SELECT " + accent + " FROM TaiDaeng where phone='" + ipatmp.onset2 + "' ");
            if (ipaSQL.length > 0)
                ipatmp.onset += ipaSQL[0].values[0][0];
            else {
                ipastr = (" ∅") + ipastr;
                continue;
            }
        }
        if (ipatmp.rime == '◌')
            ipatmp.tone = 'ˀ';
        ipaSQL = ipadb.exec("SELECT " + accent + " FROM TaiDaeng where phone='" + ipatmp.rime + "' ");
        if (ipaSQL.length > 0)
            ipatmp.rime = ipaSQL[0].values[0][0];
        else {
            ipastr = (" ∅") + ipastr;
            continue;
        }
        ipatmp.tone = ipatmp.tone.replace("꪿4", "4").replace("꫁4", "4");
        ipaSQL = ipadb.exec("SELECT " + accent + " FROM TaiDaeng where phone='" + ipatmp.tone + ipatmp.toneclass + "' ");
        if (ipaSQL.length > 0)
            ipatmp.tone = ipaSQL[0].values[0][0];
        else {
            ipastr = (" ∅") + ipastr;
            continue;
        }

        if (accent == "roman") {
            ipatmp.onset = ipatmp.onset.replace('`', '');
            ipatmp.rime = ipatmp.rime.replace('`', '');
            ipatmp.onset = ipatmp.onset.replace('0', '');
            ipatmp.onset = ipatmp.onset.replace("kw", "qu");
            if ((ipatmp.onset == "k") && !ipatmp.rime.startsWith("i") && !ipatmp.rime.startsWith("e") && !ipatmp.rime.startsWith("ê")) {
                ipatmp.onset = ipatmp.onset.replace("k", "c").replace("g", "gh").replace("ng", "ngh");
            }
			if (ipatmp.rime.startsWith("i") && (ipatmp.onset.endsWith("w") || ipatmp.onset.endsWith("qu"))) {
                ipatmp.onset = ipatmp.onset.replace("w", "u");
                ipatmp.rime = ipatmp.rime.replace("i", "y");
                ipatmp.rime = ipatmp.rime.replace("yy", "yi");
            }
            else if (ipatmp.rime.startsWith("ơ") || ipatmp.rime.startsWith("ê") || ipatmp.rime.startsWith("â")|| ipatmp.rime.startsWith("y")) {
                ipatmp.onset = ipatmp.onset.replace("w", "u");
            } else {
                ipatmp.onset = ipatmp.onset.replace("w", "o");
            }
            ipastr = " " + ipatmp.onset.replace('ʔ','') + TaiYorimetone(ipatmp.rime, ipatmp.tone.replace('ˀ', '').replace('0', '').replace('4', '').replace('5', '')) + ipastr;
        }
        else
            ipastr = " " + ipatmp.onset + ipatmp.rime + ipatmp.tone + ipastr;
    }

    return (ipastr.substring(1));
}
function TaiDamIPA(w, accent) {
    var ipastr = "";
    var ipa = {};
    var tmpconso = "";
    ipa.onset = "", ipa.onset2 = "", ipa.rime = "", ipa.tone = "", ipa.toneclass = 0;
    var ipalist = [];
    w = w.replace('ꫛ', 'ꪶꪁꪙ');
    w = w.replace('ꫜ', 'ꪙꪳ꪿ꪉ');
    for (var i = 0; i < w.length; i++) {
        var c = w.charAt(i);
        if ("ꪟꪀꪄꪈꪬꪮꪆꪊꪐꪤꪒꪔꪖꪘꪎꪦꪨꪚꪜꪢꪠꪪꪁꪅꪉꪭꪯꪇꪋꪑꪥꪓꪕꪗꪙꪏꪧꪩꪛꪝꪣꪡꪫ".includes(c)) {
            if (ipa.onset == "") {
                ipa.onset = c;
                ipa.rime += "◌";
                if ("ꪀꪄꪈꪬꪮꪆꪊꪐꪤꪒꪔꪖꪘꪎꪦꪨꪚꪜꪢꪠꪪ".includes(c))
                    ipa.toneclass = 1;
                else if ("ꪟꪁꪅꪉꪭꪯꪇꪋꪑꪥꪓꪕꪗꪙꪏꪧꪩꪛꪝꪣꪡꪫ".includes(c))
                    ipa.toneclass = 2;
            }
            else if (((ipa.rime == "") || (ipa.rime.endsWith("◌"))) && (c != "ꪮ") && (!ipa.onset2.endsWith("1"))) {
                if (c == "ꪫ") {
                    c = "ꪫ1";
                }
                ipa.onset2 += c;
            }
            else {
                if ("ꪀꪒꪚ".includes(c)) {
                    tmpconso = c;
                    if (c == "ꪀ") {
                        if (ipa.tone == "") {
                            ipa.tone = "ˀ";
                        }
                        else {
                            ipa.tone += "4";
                        }
                    } else if ((ipa.tone == "") && (ipa.toneclass==2)) {
                        if ("◌ꪳ◌ꪱ◌ꪮꪹ◌ꪵ◌◌ꪸ◌ꪺꪹ◌ꪷ".includes(ipa.rime)) {
                            ipa.tone = "5";
                        }
                        else {
                            ipa.tone = "4";
							c = "̽"+c;
                        }
                    } else if ((ipa.tone == "") && (ipa.toneclass==1)) {
                            ipa.tone = "5";
                    } else if ((ipa.tone == "꪿") && (ipa.toneclass==1)) {
                            ipa.tone = "4";
                    }
                    ipa.rime += c;

                    ipalist.push(Object.assign({}, ipa));
                    ipa.onset = "";
                    ipa.onset2 = "";
                    ipa.rime = "";
                    ipa.tone = "";
                    ipa.toneclass = 0;
                    continue;
                }
                else if ("ꪥꪫꪉꪙꪣ".includes(c)) {
                    tmpconso = c;
                    if (ipa.tone == "") {
                        ipa.tone = "0";
                    }
                    if (ipa.onset == "") {
                        ipa.onset = "∅";
                    }
                    ipa.rime += c;
                    ipa.rime = ipa.rime.replace("̽", "");

                    ipalist.push(Object.assign({}, ipa));
                    ipa.onset = "";
                    ipa.onset2 = "";
                    ipa.rime = "";
                    ipa.tone = "";
                    ipa.toneclass = 0;
                    continue;
                }
                else if (c == "ꪮ") {
                    tmpconso = c;
                    ipa.rime += c;
                }
                else {
                    if (ipa.tone == "") {
                        ipa.tone = "0";
                        if ((ipa.onset2 != "") && ((ipa.rime == "ꪵ◌") || (ipa.rime == "ꪹ◌") || (ipa.rime == "ꪶ◌"))) {
                            var coda = ipa.onset2.slice(-1);
                            if (coda == "1") {
                                ipa.onset2 = ipa.onset2.slice(0, -1);
                                coda = ipa.onset2.slice(-1);
                            }
                            if ("ꪀꪒꪚ".includes(coda)) {
                                if (coda == "ꪀ") {
                                    if (ipa.tone == "") {
                                        ipa.tone = "ˀ";
                                    }
                                    else {
                                        ipa.tone += "4";
                                    }
                                } else if ((ipa.tone == "") && (ipa.toneclass==2)) {
                        if ("◌ꪳ◌ꪱ◌ꪮꪹ◌ꪵ◌◌ꪸ◌ꪺꪹ◌ꪷ".includes(ipa.rime)) {
                            ipa.tone = "5";
                        }
                        else {
                            ipa.tone = "4";
							coda = "̽"+coda;
                        }
                    } else if ((ipa.tone == "") && (ipa.toneclass==1)) {
                            ipa.tone = "5";
                    } else if ((ipa.tone == "꪿") && (ipa.toneclass==1)) {
                            ipa.tone = "4";
                    }
                                ipa.rime += coda;
                                ipa.onset2 = ipa.onset2.slice(0, -1);
                            }
                            else if ("ꪥꪫꪉꪙꪣ".includes(coda)) {
                                if (ipa.tone == "") {
                                    ipa.tone = "0";
                                }
                                if (ipa.onset == "") {
                                    ipa.onset = "∅";
                                }
                                ipa.rime += coda;
                                ipa.onset2 = ipa.onset2.slice(0, -1);
                            }
                            else if (coda == "ꪮ") {
                                ipa.rime += coda;
                                ipa.onset2 = ipa.onset2.slice(0, -1);
                            }
                            else {
                                ipa.tone = "0";
                            }
                        }
                    }
                    tmpconso = "";
                    ipa.rime = ipa.rime.replace("̽", "");
                    ipalist.push(Object.assign({}, ipa));
                    ipa.onset = "";
                    ipa.onset2 = "";
                    ipa.rime = "";
                    ipa.tone = "";
                    ipa.toneclass = 0;
                    i--;
                    continue;
                }
            }
        }
        else if ("꪿꫁".includes(c)) {
            ipa.tone = c;
            ipa.rime += "̽";
        }
        else if ((ipa.rime != "") && ("ꪵꪹꪶꪻꪼ".includes(c))) {
            if (ipa.tone == "") {
                ipa.tone = "0";
                if ((ipa.onset2 != "") && ((ipa.rime == "ꪵ◌") || (ipa.rime == "ꪹ◌") || (ipa.rime == "ꪶ◌"))) {
                    var coda = ipa.onset2.slice(-1);
                    if (coda == "1") {
                        ipa.onset2 = ipa.onset2.slice(0, -1);
                        coda = ipa.onset2.slice(-1);
                    }
                    if ("ꪀꪒꪚ".includes(coda)) {
                        if (coda == "ꪀ") {
                            if (ipa.tone == "") {
                                ipa.tone = "ˀ";
                            }
                            else {
                                ipa.tone += "4";
                            }
                        }  else if ((ipa.tone == "") && (ipa.toneclass==2)) {
                        if ("◌ꪳ◌ꪱ◌ꪮꪹ◌ꪵ◌◌ꪸ◌ꪺꪹ◌ꪷ".includes(ipa.rime)) {
                            ipa.tone = "5";
                        }
                        else {
                            ipa.tone = "4";
							coda = "̽"+coda;
                        }
                    } else if ((ipa.tone == "") && (ipa.toneclass==1)) {
                            ipa.tone = "5";
                    } else if ((ipa.tone == "꪿") && (ipa.toneclass==1)) {
                            ipa.tone = "4";
                    }
                        ipa.rime += coda;
                        ipa.onset2 = ipa.onset2.slice(0, -1);
                    }
                    else if ("ꪥꪫꪉꪙꪣ".includes(coda)) {
                        if (ipa.tone == "") {
                            ipa.tone = "0";
                        }
                        if (ipa.onset == "") {
                            ipa.onset = "∅";
                        }
                        ipa.rime += coda;
                        ipa.onset2 = ipa.onset2.slice(0, -1);
                    }
                    else if (coda == "ꪮ") {
                        ipa.rime += coda;
                        ipa.onset2 = ipa.onset2.slice(0, -1);
                    }
                    else {
                        ipa.tone = "0";
                    }
                }
            }
            ipa.rime = ipa.rime.replace("̽", "");
            ipalist.push(Object.assign({}, ipa));
            ipa.onset = "";
            ipa.onset2 = "";
            ipa.rime = "";
            ipa.tone = "";
            ipa.toneclass = 0;
            i--;
            continue;
        }
        else {
            if ((ipa.onset == "") && (!"ꪵ◌ꪹ◌ꪶ◌ꪻ◌ꪼ◌".includes(c))) {
                if ("ꪟꪀꪄꪈꪬꪮꪆꪊꪐꪤꪒꪔꪖꪘꪎꪦꪨꪚꪜꪢꪠꪪꪁꪅꪉꪭꪯꪇꪋꪑꪥꪓꪕꪗꪙꪏꪧꪩꪛꪝꪣꪡꪫ".includes(tmpconso)) {
                    tmpconso = "";
                    var previpa = ipalist.pop();
                    previpa.rime = previpa.rime.slice(0, -1);
                    if ((previpa.tone == "ˀ") || (previpa.tone == "4") || (previpa.tone == "5"))
                        previpa.tone = "0";
                    else if (previpa.tone.endsWith("4")) {
                        previpa.tone = previpa.tone[0];
                    }
                    previpa.rime = previpa.rime.replace("̽", "");
                    ipalist.push(Object.assign({}, previpa));
                    ipa.onset = "";
                    ipa.onset2 = "";
                    ipa.rime = "";
                    ipa.tone = "";
                    ipa.toneclass = 0;
                    i -= 2;
                    continue;
                }
                else {
                    tmpconso = "";
                    ipa.onset = "∅";
                }
            }
            ipa.rime += c;
        }
    }

    if ((ipa.onset2 != "") && ((ipa.rime == "ꪵ◌") || (ipa.rime == "ꪹ◌") || (ipa.rime == "ꪶ◌"))) {
        var coda = ipa.onset2.slice(-1);
        if (coda == "1") {
            ipa.onset2 = ipa.onset2.slice(0, -1);
            coda = ipa.onset2.slice(-1);
        }
        if ("ꪀꪒꪚ".includes(coda)) {
            if (coda == "ꪀ") {
                if (ipa.tone == "") {
                    ipa.tone = "ˀ";
                }
                else {
                    ipa.tone += "4";
                }
            }  else if ((ipa.tone == "") && (ipa.toneclass==2)) {
                        if ("◌ꪳ◌ꪱ◌ꪮꪹ◌ꪵ◌◌ꪸ◌ꪺꪹ◌ꪷ".includes(ipa.rime)) {
                            ipa.tone = "5";
                        }
                        else {
                            ipa.tone = "4";
							coda = "̽"+coda;
                        }
                    } else if ((ipa.tone == "") && (ipa.toneclass==1)) {
                            ipa.tone = "5";
                    } else if ((ipa.tone == "꪿") && (ipa.toneclass==1)) {
                            ipa.tone = "4";
                    }
            ipa.rime += coda;
            ipa.onset2 = ipa.onset2.slice(0, -1);
        }
        else if ("ꪥꪫꪉꪙꪣ".includes(coda)) {
            if (ipa.tone == "") {
                ipa.tone = "0";
            }
            if (ipa.onset == "") {
                ipa.onset = "∅";
            }
            ipa.rime += coda;
            ipa.onset2 = ipa.onset2.slice(0, -1);
        }
        else if (coda == "ꪮ") {
            ipa.rime += coda;
            ipa.onset2 = ipa.onset2.slice(0, -1);
        }
        else {
            ipa.tone = "0";
        }
    }
	if (ipa.tone!="4") {
		ipa.rime = ipa.rime.replace("̽", "");
	}
    if (ipa.tone == "") {
        ipa.tone = "0";
    }
    if (ipa.onset == "") {
        ipa.onset = "∅";
        if (ipalist.length == 0)
            ipalist.push(Object.assign({}, ipa));
    }
    else
        ipalist.push(Object.assign({}, ipa));

    var minorsyllable = "";
    ipaSQL = ipadb.exec("SELECT " + accent + " FROM TaiDam where phone='◌' ");
    if (ipaSQL.length > 0)
        minorsyllable = ipaSQL[0].values[0][0];

    while (ipalist.length != 0) {
        var ipatmp = ipalist.pop();
        var minortone = "";
        ipaSQL = ipadb.exec("SELECT " + accent + " FROM TaiDam where phone='ˀ" + ipatmp.toneclass + "' ");
        if (ipaSQL.length > 0)
            minortone = ipaSQL[0].values[0][0];
        var onsets = [ipatmp.onset];
        if (ipatmp.onset2.endsWith("1")) {
            onsets = onsets.concat(ipatmp.onset2.slice(0, -2).split(''));
            ipatmp.onset2 = ipatmp.onset2.slice(-2);
        }
        else {
            onsets = onsets.concat(ipatmp.onset2.split(''));
            ipatmp.onset2 = "";
        }

        ipaSQL = ipadb.exec("SELECT " + accent + " FROM TaiDam where phone='" + onsets.join('') + "' ");
        if (ipaSQL.length > 0)
            ipatmp.onset = ipaSQL[0].values[0][0];
        else {
            ipaSQL = ipadb.exec("SELECT " + accent + " FROM TaiDam where phone='" + onsets[onsets.length - 1] + "' ");
            if (ipaSQL.length > 0)
                ipatmp.onset = ipaSQL[0].values[0][0];
            else {
                ipatmp.onset = "∅";
            }
            for (var j = (onsets.length - 2); j >= 0; j--) {
                ipaSQL = ipadb.exec("SELECT " + accent + " FROM TaiDam where phone='" + onsets[j] + "' ");
                if (ipaSQL.length > 0)
                    ipatmp.onset = ipaSQL[0].values[0][0] + minorsyllable + minortone + " " + ipatmp.onset;
                else {
                    ipatmp.onset = "∅";
                }
            }
        }
        if (ipatmp.onset2 != "") {
            ipaSQL = ipadb.exec("SELECT " + accent + " FROM TaiDam where phone='" + ipatmp.onset2 + "' ");
            if (ipaSQL.length > 0)
                ipatmp.onset += ipaSQL[0].values[0][0];
            else {
                ipastr = (" ∅") + ipastr;
                continue;
            }
        }
        if (ipatmp.rime == '◌')
            ipatmp.tone = 'ˀ';
        ipaSQL = ipadb.exec("SELECT " + accent + " FROM TaiDam where phone='" + ipatmp.rime + "' ");
        if (ipaSQL.length > 0)
            ipatmp.rime = ipaSQL[0].values[0][0];
        else {
            ipastr = (" ∅") + ipastr;
            continue;
        }
        ipatmp.tone = ipatmp.tone.replace("꪿4", "4").replace("꫁4", "4");
        ipaSQL = ipadb.exec("SELECT " + accent + " FROM TaiDam where phone='" + ipatmp.tone + ipatmp.toneclass + "' ");
        if (ipaSQL.length > 0)
            ipatmp.tone = ipaSQL[0].values[0][0];
        else {
            ipastr = (" ∅") + ipastr;
            continue;
        }

        if (accent == "roman") {
            ipatmp.onset = ipatmp.onset.replace('`', '');
            ipatmp.rime = ipatmp.rime.replace('`', '');
            ipatmp.onset = ipatmp.onset.replace("kw", "qu");
            if ((ipatmp.onset == "k") && !ipatmp.rime.startsWith("i") && !ipatmp.rime.startsWith("e") && !ipatmp.rime.startsWith("ê")) {
                ipatmp.onset = ipatmp.onset.replace("k", "c").replace("g", "gh").replace("ng", "ngh");
            }
			if (ipatmp.rime.startsWith("i") && (ipatmp.onset.endsWith("w") || ipatmp.onset.endsWith("qu"))) {
                ipatmp.onset = ipatmp.onset.replace("w", "u");
                ipatmp.rime = ipatmp.rime.replace("i", "y");
            }
            else if (ipatmp.rime.startsWith("ơ") || ipatmp.rime.startsWith("ê") || ipatmp.rime.startsWith("â") || ipatmp.rime.startsWith("y")) {
                ipatmp.onset = ipatmp.onset.replace("w", "u");
            } else {
                ipatmp.onset = ipatmp.onset.replace("w", "o");
            }
           // if ((ipatmp.tone == "́4") && (!ipatmp.rime.endsWith("c"))) {
           //     ipatmp.tone = "";
           // }
            ipastr = " " + ipatmp.onset.replace('ʔ','') + TaiYorimetone(ipatmp.rime, ipatmp.tone.replace('ˀ', '').replace('0', '').replace('4', '').replace('5', '')) + ipastr;
        }
        else
            ipastr = " " + ipatmp.onset + ipatmp.rime + ipatmp.tone + ipastr;
    }

    return (ipastr.substring(1));
}
function TaiPaoIPA(w, accent) {
    var ipastr = "";
    var ipa = {};
    var tmpconso = "";
    ipa.onset = "", ipa.onset2 = "", ipa.rime = "", ipa.tone = "", ipa.toneclass = 0;
    var ipalist = [];

    for (var i = 0; i < [...w].length; i++) {
        var c = [...w][i];
        if ("𕉐𕉔𕉘𕉼𕉾𕉖𕉚𕉠𕉴𕉢𕉤𕉦𕉨𕉞𕉸𕉪𕉬𕉮𕉳𕉰𕉺𕉜𕉒𕉶𕉑𕉕𕉙𕉽𕉿𕉗𕉛𕉡𕉵𕉣𕉥𕉧𕉩𕉟𕉷𕉹𕉫𕉭𕉯𕉳𕉱𕉻𕉝𕉓".includes(c)) {
            if (ipa.onset == "") {
                ipa.onset = c;
                if ("𕉐𕉔𕉘𕉼𕉾𕉖𕉚𕉠𕉴𕉢𕉤𕉦𕉨𕉞𕉸𕉪𕉬𕉮𕉳𕉰𕉺𕉜𕉒𕉶".includes(c))
                    ipa.toneclass = 1;
                else if ("𕉑𕉕𕉙𕉽𕉿𕉗𕉛𕉡𕉵𕉣𕉥𕉧𕉩𕉟𕉷𕉹𕉫𕉭𕉯𕉳𕉱𕉻𕉝𕉓".includes(c))
                    ipa.toneclass = 2;
            }
            else if ((ipa.rime == "") && (ipa.tone == "") && (ipa.onset != "") && (c == "𕉻") && (!ipa.onset2.endsWith("1"))) {
                c = "𕉻1";
                ipa.onset2 += c;
            }
            else if ((ipa.rime != "") && ("𕉐𕉢𕉪".includes(c))) {
                tmpconso = c;
                if ("𕊀𕊉𕊈𕊄𕊂𕊃𕊇𕊋".includes(ipa.rime) && ipa.tone != "𕊑")
                    ipa.tone = "5";
				else if (ipa.tone != "𕊑") {
                    ipa.tone = "5";
					ipa.rime = "𕊑" + ipa.rime;
				}
                else {
                    if ("𕊀𕊉𕊄𕊂𕊃𕊇𕊋".includes(ipa.rime))
                        ipa.rime = ipa.rime + ipa.tone;
                    else
                        ipa.rime = ipa.tone + ipa.rime;
                    ipa.tone = "4";
                }
                ipa.rime += c;

                ipalist.push(Object.assign({}, ipa));
                ipa.onset = "";
                ipa.onset2 = "";
                ipa.rime = "";
                ipa.tone = "";
                ipa.toneclass = 0;
                continue;
            }
            else if ((ipa.rime != "") && ("𕉵𕉻𕉙𕉩𕉳".includes(c))) {
                tmpconso = c;
                if (ipa.tone == "") {
                    ipa.tone = "0";
                }
                if (ipa.onset == "") {
                    ipa.onset = "∅";
                }
                ipa.rime += c;

                ipalist.push(Object.assign({}, ipa));
                ipa.onset = "";
                ipa.onset2 = "";
                ipa.rime = "";
                ipa.tone = "";
                ipa.toneclass = 0;
                continue;
            }
            else {
                tmpconso = "";
                if (ipa.tone == "") {
                    ipa.tone = "0";
                }
                if (ipa.rime == "") {
                    ipa.rime = "◌";
                }

                ipalist.push(Object.assign({}, ipa));
                ipa.onset = "";
                ipa.onset2 = "";
                ipa.rime = "";
                ipa.tone = "";
                ipa.toneclass = 0;
                i--;
                continue;
            }
        }
        else if ("𕊑𕊒".includes(c)) {
            ipa.tone = c;
        }
        else {
            if (ipa.onset == "") {
                if ("𕉐𕉔𕉘𕉼𕉾𕉖𕉚𕉠𕉴𕉢𕉤𕉦𕉨𕉞𕉸𕉪𕉬𕉮𕉳𕉰𕉺𕉜𕉒𕉶𕉑𕉕𕉙𕉽𕉿𕉗𕉛𕉡𕉵𕉣𕉥𕉧𕉩𕉧𕉷𕉹𕉫𕉭𕉯𕉳𕉱𕉻𕉝𕉓".includes(tmpconso)) {
                    tmpconso = "";
                    var previpa = ipalist.pop();
                    previpa.rime = [...previpa.rime].slice(0, -1);
                    if (previpa.tone == "4")
                        previpa.tone = "0";
                    ipalist.push(Object.assign({}, previpa));
                    ipa.onset = "";
                    ipa.onset2 = "";
                    ipa.rime = "";
                    ipa.tone = "";
                    ipa.toneclass = 0;
                    i -= 2;
                    continue;
                }
                else {
                    tmpconso = "";
                    ipa.onset = "∅";
                }
            }
            ipa.rime += c;
        }
    }

    if (ipa.tone == "") {
        ipa.tone = "0";
    }
    if (ipa.rime == "") {
        ipa.rime = "◌";
    }
    if (ipa.onset == "") {
        ipa.onset = "∅";
        if (ipalist.length == 0)
            ipalist.push(Object.assign({}, ipa));
    }
    else
        ipalist.push(Object.assign({}, ipa));

    while (ipalist.length != 0) {
        var ipatmp = ipalist.pop();
        ipaSQL = ipadb.exec("SELECT " + accent + " FROM TaiPao where phone='" + ipatmp.onset + "' ");
        if (ipaSQL.length > 0)
            ipatmp.onset = ipaSQL[0].values[0];
        else {
            ipastr = (" ∅") + ipastr;
            continue;
        }
        if (ipatmp.onset2 != "") {
            ipaSQL = ipadb.exec("SELECT " + accent + " FROM TaiPao where phone='" + ipatmp.onset2 + "' ");
            if (ipaSQL.length > 0)
                ipatmp.onset += ipaSQL[0].values[0];
            else {
                ipastr = (" ∅") + ipastr;
                continue;
            }
        }
        ipaSQL = ipadb.exec("SELECT " + accent + " FROM TaiPao where phone='" + ipatmp.rime + "' ");
        if (ipaSQL.length > 0)
            ipatmp.rime = ipaSQL[0].values[0];
        else {
            ipastr = (" ∅") + ipastr;
            continue;
        }
        ipaSQL = ipadb.exec("SELECT " + accent + " FROM TaiPao where phone='" + ipatmp.tone + ipatmp.toneclass + "' ");
        if (ipaSQL.length > 0)
            ipatmp.tone = ipaSQL[0].values[0];
        else {
            ipastr = (" ∅") + ipastr;
            continue;
        }

        if (accent == "roman") {
            ipatmp.onset = (ipatmp.onset + "").replace('`', '');
            ipastr = " " + ipatmp.onset.replace('ʔ','') + TaiYorimetone(ipatmp.rime[0], ipatmp.tone[0].replace('ˀ', '')) + ipastr;
        }
        else
            ipastr = " " + ipatmp.onset + ipatmp.rime + ipatmp.tone + ipastr;
    }

    return (ipastr.substring(1));
}

function TaiDonRoma(w) {
    var ipa = {};
    ipa.onset = "", ipa.rime = "", ipa.tone = "", ipa.glide = "";
    var toneclass = 1;
    w = w.replace("qu", "kw");
    for (var i = 0; i < w.length; i++) {
        var c = w.charAt(i);
        if ("qrtpsdđfghjklzxcvbnmw".includes(c)) {
            ipa.onset += c;
        }
        else {
            ipa.rime = w.substring(i);
            break;
        }
    }

    for (var i = 0; i < ipa.rime.length; i++) {
        var c = ipa.rime.charAt(i);
        var c_plain = "";
        switch (c) {
            case 'á': ipa.tone = "́"; c_plain = 'a'; break; case 'à': ipa.tone = "̀"; c_plain = 'a'; toneclass = 2; break; case 'ả': ipa.tone = "̉"; c_plain = 'a'; break; case 'ã': ipa.tone = "̃"; c_plain = 'a'; toneclass = 2; break; case 'ạ': ipa.tone = "̣"; c_plain = 'a'; toneclass = 2; break;
            case 'ấ': ipa.tone = "́"; c_plain = 'â'; break; case 'ầ': ipa.tone = "̀"; c_plain = 'â'; toneclass = 2; break; case 'ẩ': ipa.tone = "̉"; c_plain = 'â'; break; case 'ẫ': ipa.tone = "̃"; c_plain = 'â'; toneclass = 2; break; case 'ậ': ipa.tone = "̣"; c_plain = 'â'; toneclass = 2; break;
            case 'ắ': ipa.tone = "́"; c_plain = 'ă'; break; case 'ằ': ipa.tone = "̀"; c_plain = 'ă'; toneclass = 2; break; case 'ẳ': ipa.tone = "̉"; c_plain = 'ă'; break; case 'ẵ': ipa.tone = "̃"; c_plain = 'ă'; toneclass = 2; break; case 'ặ': ipa.tone = "̣"; c_plain = 'ă'; toneclass = 2; break;
            case 'é': ipa.tone = "́"; c_plain = 'e'; break; case 'è': ipa.tone = "̀"; c_plain = 'e'; toneclass = 2; break; case 'ẻ': ipa.tone = "̉"; c_plain = 'e'; break; case 'ẽ': ipa.tone = "̃"; c_plain = 'e'; toneclass = 2; break; case 'ẹ': ipa.tone = "̣"; c_plain = 'e'; toneclass = 2; break;
            case 'ế': ipa.tone = "́"; c_plain = 'ê'; break; case 'ề': ipa.tone = "̀"; c_plain = 'ê'; toneclass = 2; break; case 'ể': ipa.tone = "̉"; c_plain = 'ê'; break; case 'ễ': ipa.tone = "̃"; c_plain = 'ê'; toneclass = 2; break; case 'ệ': ipa.tone = "̣"; c_plain = 'ê'; toneclass = 2; break;
            case 'í': ipa.tone = "́"; c_plain = 'i'; break; case 'ì': ipa.tone = "̀"; c_plain = 'i'; toneclass = 2; break; case 'ỉ': ipa.tone = "̉"; c_plain = 'i'; break; case 'ĩ': ipa.tone = "̃"; c_plain = 'i'; toneclass = 2; break; case 'ị': ipa.tone = "̣"; c_plain = 'i'; toneclass = 2; break;
            case 'ó': ipa.tone = "́"; c_plain = 'o'; break; case 'ò': ipa.tone = "̀"; c_plain = 'o'; toneclass = 2; break; case 'ỏ': ipa.tone = "̉"; c_plain = 'o'; break; case 'õ': ipa.tone = "̃"; c_plain = 'o'; toneclass = 2; break; case 'ọ': ipa.tone = "̣"; c_plain = 'o'; toneclass = 2; break;
            case 'ố': ipa.tone = "́"; c_plain = 'ô'; break; case 'ồ': ipa.tone = "̀"; c_plain = 'ô'; toneclass = 2; break; case 'ổ': ipa.tone = "̉"; c_plain = 'ô'; break; case 'ỗ': ipa.tone = "̃"; c_plain = 'ô'; toneclass = 2; break; case 'ộ': ipa.tone = "̣"; c_plain = 'ô'; toneclass = 2; break;
            case 'ớ': ipa.tone = "́"; c_plain = 'ơ'; break; case 'ờ': ipa.tone = "̀"; c_plain = 'ơ'; toneclass = 2; break; case 'ở': ipa.tone = "̉"; c_plain = 'ơ'; break; case 'ỡ': ipa.tone = "̃"; c_plain = 'ơ'; toneclass = 2; break; case 'ợ': ipa.tone = "̣"; c_plain = 'ơ'; toneclass = 2; break;
            case 'ú': ipa.tone = "́"; c_plain = 'u'; break; case 'ù': ipa.tone = "̀"; c_plain = 'u'; toneclass = 2; break; case 'ủ': ipa.tone = "̉"; c_plain = 'u'; break; case 'ũ': ipa.tone = "̃"; c_plain = 'u'; toneclass = 2; break; case 'ụ': ipa.tone = "̣"; c_plain = 'u'; toneclass = 2; break;
            case 'ứ': ipa.tone = "́"; c_plain = 'ư'; break; case 'ừ': ipa.tone = "̀"; c_plain = 'ư'; toneclass = 2; break; case 'ử': ipa.tone = "̉"; c_plain = 'ư'; break; case 'ữ': ipa.tone = "̃"; c_plain = 'ư'; toneclass = 2; break; case 'ự': ipa.tone = "̣"; c_plain = 'ư'; toneclass = 2; break;
            case 'ý': ipa.tone = "́"; c_plain = 'y'; break; case 'ỳ': ipa.tone = "̀"; c_plain = 'y'; toneclass = 2; break; case 'ỷ': ipa.tone = "̉"; c_plain = 'y'; break; case 'ỹ': ipa.tone = "̃"; c_plain = 'y'; toneclass = 2; break; case 'ỵ': ipa.tone = "̣"; c_plain = 'y'; toneclass = 2; break;
            default: c_plain = c; break;
        }
        if (c_plain != c) {
            ipa.rime = ipa.rime.substr(0, i) + c_plain + ipa.rime.substr(i + 1);
            break;
        }
    }
    var deadcons = ipa.rime.slice(ipa.rime.length - 1);
    if ("c".includes(deadcons))
        ipa.tone += "4";
    if ("k".includes(deadcons))
        ipa.tone += "ˀ";

    if (ipa.tone == "") {
        ipa.tone = "0";
    }
    if (ipa.onset == "") {
        ipa.onset = "ʔ";
    }
    if (toneclass == 2) {
        ipa.onset += "`";
    }
    if (ipa.rime.startsWith("oa") || ipa.rime.startsWith("oă") || ipa.rime.startsWith("uâ") || ipa.rime.startsWith("oe") || ipa.rime.startsWith("uê") || ipa.rime.startsWith("uy") || ipa.rime.startsWith("uơ")) {
        ipa.glide = "ꪫ";
        ipa.rime = ipa.rime.substring(1);
    }
    if ((ipa.onset == "kw")) {
        ipa.onset = "k";
        ipa.glide = "ꪫ";
    }
    else if ((ipa.onset == "kw`")) {
        ipa.onset = "k`";
        ipa.glide = "ꪫ";
    }
    ipa.onset = ipa.onset.replace("gh", "g");
    if ((ipa.onset == "c") || (ipa.onset == "c`"))
        ipa.onset = ipa.onset.replace("c", "k");
    if ((ipa.glide == "ꪫ") && ((ipa.rime == "e") || (ipa.rime == "ê"))) {
        ipa.rime += "`";
    }

    ipaSQL = ipadb.exec("SELECT phone FROM TaiDon where roman='" + ipa.rime + "' ");
    if (ipaSQL.length > 0)
        ipa.rime = ipaSQL[0].values[0] + "";
    else
        return w;
    if ("c".includes(deadcons)) {
        if (toneclass == 1)
            ipa.rime = ipa.rime.replace('̽', '꪿');
        else
            ipa.rime = ipa.rime.replace('̽', '꫁');
    }

    if ("pt".includes(deadcons)) {
        if (ipa.rime.startsWith("ă") || ipa.rime.startsWith("oă") || ipa.rime.startsWith("ê") || ipa.rime.startsWith("uê") || ipa.rime.startsWith("uy") || ipa.rime.startsWith("i") || ipa.rime.startsWith("u") || ipa.rime.startsWith("ư") || ipa.rime.startsWith("uơ") || ipa.rime.startsWith("ơ")) {
            ipa.tone = "4";
        } else {
            ipa.tone = "5";
        }
    }

    ipaSQL = ipadb.exec("SELECT phone FROM TaiDon where roman='" + ipa.onset + "' ");
    if (ipaSQL.length > 0)
        ipa.onset = ipaSQL[0].values[0] + ipa.glide;
    else
        return w;
    ipaSQL = ipadb.exec("SELECT phone FROM TaiDon where roman='" + ipa.tone + "' ");
    if (ipaSQL.length > 0) {
        ipa.tone = ipaSQL[0].values[0] + "";
        ipa.tone = ipa.tone.replace('0', '').replace('1', '').replace('2', '').replace('4', '').replace('5', '').replace('ˀ', '');
    }
    else
        return w;

    var res = ("" + ipa.rime.replace('◌', ipa.onset + ipa.tone)).replace("꪿ꪰ", "ꪰ꪿").replace("꫁ꪰ", "ꪰ꫁").replace("꪿ꪲ", "ꪲ꪿").replace("꫁ꪲ", "ꪲ꫁").replace("꪿ꪳ", "ꪳ꪿").replace("꫁ꪳ", "ꪳ꫁").replace("꪿ꪸ", "ꪸ꪿").replace("꫁ꪸ", "ꪸ꫁").replace("꪿ꪷꪷ", "ꪷꪷ꪿").replace("꪿ꪷ", "ꪷ꪿").replace("꫁ꪷꪷ", "ꪷꪷ꫁").replace("꫁ꪷ", "ꪷ꫁").replace("ꪴ꪿", "ꪴ꪿").replace("ꪴ꫁", "ꪴ꫁").replace("꪿ꪾ", "ꪾ꪿").replace("꫁ꪾ", "ꪾ꫁");
    return res;
}

function TaiKhaoRoma(w) {
    var ipa = {};
    ipa.onset = "", ipa.rime = "", ipa.tone = "", ipa.glide = "";
    var toneclass = 1;
    w = w.replace("qu", "kw");
    for (var i = 0; i < w.length; i++) {
        var c = w.charAt(i);
        if ("qrtpsdđfghjklzxcvbnmw".includes(c)) {
            ipa.onset += c;
        }
        else {
            ipa.rime = w.substring(i);
            break;
        }
    }

    for (var i = 0; i < ipa.rime.length; i++) {
        var c = ipa.rime.charAt(i);
        var c_plain = "";
        switch (c) {
            case 'á': ipa.tone = "́"; c_plain = 'a'; break; case 'à': ipa.tone = "̀"; c_plain = 'a'; toneclass = 2; break; case 'ả': ipa.tone = "̉"; c_plain = 'a'; break; case 'ã': ipa.tone = "̃"; c_plain = 'a'; toneclass = 2; break; case 'ạ': ipa.tone = "̣"; c_plain = 'a'; toneclass = 2; break;
            case 'ấ': ipa.tone = "́"; c_plain = 'â'; break; case 'ầ': ipa.tone = "̀"; c_plain = 'â'; toneclass = 2; break; case 'ẩ': ipa.tone = "̉"; c_plain = 'â'; break; case 'ẫ': ipa.tone = "̃"; c_plain = 'â'; toneclass = 2; break; case 'ậ': ipa.tone = "̣"; c_plain = 'â'; toneclass = 2; break;
            case 'ắ': ipa.tone = "́"; c_plain = 'ă'; break; case 'ằ': ipa.tone = "̀"; c_plain = 'ă'; toneclass = 2; break; case 'ẳ': ipa.tone = "̉"; c_plain = 'ă'; break; case 'ẵ': ipa.tone = "̃"; c_plain = 'ă'; toneclass = 2; break; case 'ặ': ipa.tone = "̣"; c_plain = 'ă'; toneclass = 2; break;
            case 'é': ipa.tone = "́"; c_plain = 'e'; break; case 'è': ipa.tone = "̀"; c_plain = 'e'; toneclass = 2; break; case 'ẻ': ipa.tone = "̉"; c_plain = 'e'; break; case 'ẽ': ipa.tone = "̃"; c_plain = 'e'; toneclass = 2; break; case 'ẹ': ipa.tone = "̣"; c_plain = 'e'; toneclass = 2; break;
            case 'ế': ipa.tone = "́"; c_plain = 'ê'; break; case 'ề': ipa.tone = "̀"; c_plain = 'ê'; toneclass = 2; break; case 'ể': ipa.tone = "̉"; c_plain = 'ê'; break; case 'ễ': ipa.tone = "̃"; c_plain = 'ê'; toneclass = 2; break; case 'ệ': ipa.tone = "̣"; c_plain = 'ê'; toneclass = 2; break;
            case 'í': ipa.tone = "́"; c_plain = 'i'; break; case 'ì': ipa.tone = "̀"; c_plain = 'i'; toneclass = 2; break; case 'ỉ': ipa.tone = "̉"; c_plain = 'i'; break; case 'ĩ': ipa.tone = "̃"; c_plain = 'i'; toneclass = 2; break; case 'ị': ipa.tone = "̣"; c_plain = 'i'; toneclass = 2; break;
            case 'ó': ipa.tone = "́"; c_plain = 'o'; break; case 'ò': ipa.tone = "̀"; c_plain = 'o'; toneclass = 2; break; case 'ỏ': ipa.tone = "̉"; c_plain = 'o'; break; case 'õ': ipa.tone = "̃"; c_plain = 'o'; toneclass = 2; break; case 'ọ': ipa.tone = "̣"; c_plain = 'o'; toneclass = 2; break;
            case 'ố': ipa.tone = "́"; c_plain = 'ô'; break; case 'ồ': ipa.tone = "̀"; c_plain = 'ô'; toneclass = 2; break; case 'ổ': ipa.tone = "̉"; c_plain = 'ô'; break; case 'ỗ': ipa.tone = "̃"; c_plain = 'ô'; toneclass = 2; break; case 'ộ': ipa.tone = "̣"; c_plain = 'ô'; toneclass = 2; break;
            case 'ớ': ipa.tone = "́"; c_plain = 'ơ'; break; case 'ờ': ipa.tone = "̀"; c_plain = 'ơ'; toneclass = 2; break; case 'ở': ipa.tone = "̉"; c_plain = 'ơ'; break; case 'ỡ': ipa.tone = "̃"; c_plain = 'ơ'; toneclass = 2; break; case 'ợ': ipa.tone = "̣"; c_plain = 'ơ'; toneclass = 2; break;
            case 'ú': ipa.tone = "́"; c_plain = 'u'; break; case 'ù': ipa.tone = "̀"; c_plain = 'u'; toneclass = 2; break; case 'ủ': ipa.tone = "̉"; c_plain = 'u'; break; case 'ũ': ipa.tone = "̃"; c_plain = 'u'; toneclass = 2; break; case 'ụ': ipa.tone = "̣"; c_plain = 'u'; toneclass = 2; break;
            case 'ứ': ipa.tone = "́"; c_plain = 'ư'; break; case 'ừ': ipa.tone = "̀"; c_plain = 'ư'; toneclass = 2; break; case 'ử': ipa.tone = "̉"; c_plain = 'ư'; break; case 'ữ': ipa.tone = "̃"; c_plain = 'ư'; toneclass = 2; break; case 'ự': ipa.tone = "̣"; c_plain = 'ư'; toneclass = 2; break;
            case 'ý': ipa.tone = "́"; c_plain = 'y'; break; case 'ỳ': ipa.tone = "̀"; c_plain = 'y'; toneclass = 2; break; case 'ỷ': ipa.tone = "̉"; c_plain = 'y'; break; case 'ỹ': ipa.tone = "̃"; c_plain = 'y'; toneclass = 2; break; case 'ỵ': ipa.tone = "̣"; c_plain = 'y'; toneclass = 2; break;
            default: c_plain = c; break;
        }
        if (c_plain != c) {
            ipa.rime = ipa.rime.substr(0, i) + c_plain + ipa.rime.substr(i + 1);
            break;
        }
    }
	
    var deadcons = ipa.rime.slice(ipa.rime.length - 1);
	if ("cpt".includes(deadcons)) {
        if ("́̀".includes(ipa.tone)) {
            ipa.tone += "4";
        } else {
            ipa.tone += "5";
        }
    }

    if (ipa.tone == "") {
        ipa.tone = "0";
    }
    if (ipa.onset == "") {
        ipa.onset = "ʔ";
    }
    if (toneclass == 2) {
        ipa.onset += "`";
    }
    if (ipa.rime.startsWith("oa") || ipa.rime.startsWith("oă") || ipa.rime.startsWith("uâ") || ipa.rime.startsWith("oe") || ipa.rime.startsWith("uê") || ipa.rime.startsWith("uy") || ipa.rime.startsWith("uơ")) {
        ipa.glide = "ꪫ";
        ipa.rime = ipa.rime.substring(1);
    }
    if ((ipa.onset == "kw")) {
        ipa.onset = "k";
        ipa.glide = "ꪫ";
    }
    else if ((ipa.onset == "kw`")) {
        ipa.onset = "k`";
        ipa.glide = "ꪫ";
    }
    ipa.onset = ipa.onset.replace("gh", "g");
    if ((ipa.onset == "c") || (ipa.onset == "c`"))
        ipa.onset = ipa.onset.replace("c", "k");
    if ((ipa.glide == "ꪫ") && ((ipa.rime == "e") || (ipa.rime == "ê"))) {
        ipa.rime += "`";
    }

    ipaSQL = ipadb.exec("SELECT phone FROM TaiKhao where roman='" + ipa.rime + "' ");
    if (ipaSQL.length > 0)
        ipa.rime = ipaSQL[0].values[0] + "";
    else
        return w;

    ipaSQL = ipadb.exec("SELECT phone FROM TaiKhao where roman='" + ipa.onset + "' ");
    if (ipaSQL.length > 0)
        ipa.onset = ipaSQL[0].values[0] + ipa.glide;
    else
        return w;
    ipaSQL = ipadb.exec("SELECT phone FROM TaiKhao where roman='" + ipa.tone + "' ");
    if (ipaSQL.length > 0) {
        ipa.tone = ipaSQL[0].values[0] + "";
        ipa.tone = ipa.tone.replace('0', '').replace('1', '').replace('2', '').replace('4', '').replace('5', '').replace('ˀ', '');
    }
    else
        return w;

    var res = ("" + ipa.rime.replace('◌', ipa.onset + ipa.tone)).replace("꪿ꪰ", "ꪰ꪿").replace("꫁ꪰ", "ꪰ꫁").replace("꪿ꪲ", "ꪲ꪿").replace("꫁ꪲ", "ꪲ꫁").replace("꪿ꪳ", "ꪳ꪿").replace("꫁ꪳ", "ꪳ꫁").replace("꪿ꪸ", "ꪸ꪿").replace("꫁ꪸ", "ꪸ꫁").replace("꪿ꪷꪷ", "ꪷꪷ꪿").replace("꪿ꪷ", "ꪷ꪿").replace("꫁ꪷꪷ", "ꪷꪷ꫁").replace("꫁ꪷ", "ꪷ꫁").replace("ꪴ꪿", "ꪴ꪿").replace("ꪴ꫁", "ꪴ꫁").replace("꪿ꪾ", "ꪾ꪿").replace("꫁ꪾ", "ꪾ꫁").replace("꫁ꫂ", "ꫂ꫁").replace("꪿ꫂ", "ꫂ꪿");
    return res;
}

function TaiDaengRoma(w) {
    var ipa = {};
    ipa.onset = "", ipa.rime = "", ipa.tone = "", ipa.glide = "";
    var toneclass = 1;
    w = w.replace("qu", "kw");
    for (var i = 0; i < w.length; i++) {
        var c = w.charAt(i);
        if ("qrtpsdđfghjklzxcvbnmw".includes(c)) {
            ipa.onset += c;
        }
        else {
            ipa.rime = w.substring(i);
            break;
        }
    }

    for (var i = 0; i < ipa.rime.length; i++) {
        var c = ipa.rime.charAt(i);
        var c_plain = "";
        switch (c) {
            case 'á': ipa.tone = "́"; c_plain = 'a'; break; case 'à': ipa.tone = "̀"; c_plain = 'a'; toneclass = 2; break; case 'ả': ipa.tone = "̉"; c_plain = 'a'; break; case 'ã': ipa.tone = "̃"; c_plain = 'a'; toneclass = 2; break; case 'ạ': ipa.tone = "̣"; c_plain = 'a'; toneclass = 2; break;
            case 'ấ': ipa.tone = "́"; c_plain = 'â'; break; case 'ầ': ipa.tone = "̀"; c_plain = 'â'; toneclass = 2; break; case 'ẩ': ipa.tone = "̉"; c_plain = 'â'; break; case 'ẫ': ipa.tone = "̃"; c_plain = 'â'; toneclass = 2;  break; case 'ậ': ipa.tone = "̣"; c_plain = 'â'; toneclass = 2; break;
            case 'ắ': ipa.tone = "́"; c_plain = 'ă'; break; case 'ằ': ipa.tone = "̀"; c_plain = 'ă'; toneclass = 2; break; case 'ẳ': ipa.tone = "̉"; c_plain = 'ă'; break; case 'ẵ': ipa.tone = "̃"; c_plain = 'ă'; toneclass = 2;  break; case 'ặ': ipa.tone = "̣"; c_plain = 'ă'; toneclass = 2; break;
            case 'é': ipa.tone = "́"; c_plain = 'e';break; case 'è': ipa.tone = "̀"; c_plain = 'e'; toneclass = 2; break; case 'ẻ': ipa.tone = "̉"; c_plain = 'e'; break; case 'ẽ': ipa.tone = "̃"; c_plain = 'e'; toneclass = 2;  break; case 'ẹ': ipa.tone = "̣"; c_plain = 'e'; toneclass = 2; break;
            case 'ế': ipa.tone = "́"; c_plain = 'ê'; break; case 'ề': ipa.tone = "̀"; c_plain = 'ê'; toneclass = 2; break; case 'ể': ipa.tone = "̉"; c_plain = 'ê'; break; case 'ễ': ipa.tone = "̃"; c_plain = 'ê'; toneclass = 2;  break; case 'ệ': ipa.tone = "̣"; c_plain = 'ê'; toneclass = 2; break;
            case 'í': ipa.tone = "́"; c_plain = 'i'; break; case 'ì': ipa.tone = "̀"; c_plain = 'i'; toneclass = 2; break; case 'ỉ': ipa.tone = "̉"; c_plain = 'i'; break; case 'ĩ': ipa.tone = "̃"; c_plain = 'i'; toneclass = 2;  break; case 'ị': ipa.tone = "̣"; c_plain = 'i'; toneclass = 2; break;
            case 'ó': ipa.tone = "́"; c_plain = 'o'; break; case 'ò': ipa.tone = "̀"; c_plain = 'o'; toneclass = 2; break; case 'ỏ': ipa.tone = "̉"; c_plain = 'o'; break; case 'õ': ipa.tone = "̃"; c_plain = 'o'; toneclass = 2;  break; case 'ọ': ipa.tone = "̣"; c_plain = 'o'; toneclass = 2; break;
            case 'ố': ipa.tone = "́"; c_plain = 'ô'; break; case 'ồ': ipa.tone = "̀"; c_plain = 'ô'; toneclass = 2; break; case 'ổ': ipa.tone = "̉"; c_plain = 'ô'; break; case 'ỗ': ipa.tone = "̃"; c_plain = 'ô'; toneclass = 2;  break; case 'ộ': ipa.tone = "̣"; c_plain = 'ô'; toneclass = 2; break;
            case 'ớ': ipa.tone = "́"; c_plain = 'ơ'; break; case 'ờ': ipa.tone = "̀"; c_plain = 'ơ'; toneclass = 2; break; case 'ở': ipa.tone = "̉"; c_plain = 'ơ'; break; case 'ỡ': ipa.tone = "̃"; c_plain = 'ơ'; toneclass = 2;  break; case 'ợ': ipa.tone = "̣"; c_plain = 'ơ'; toneclass = 2; break;
            case 'ú': ipa.tone = "́"; c_plain = 'u'; break; case 'ù': ipa.tone = "̀"; c_plain = 'u'; toneclass = 2; break; case 'ủ': ipa.tone = "̉"; c_plain = 'u'; break; case 'ũ': ipa.tone = "̃"; c_plain = 'u'; toneclass = 2;  break; case 'ụ': ipa.tone = "̣"; c_plain = 'u'; toneclass = 2; break;
            case 'ứ': ipa.tone = "́"; c_plain = 'ư'; break; case 'ừ': ipa.tone = "̀"; c_plain = 'ư'; toneclass = 2; break; case 'ử': ipa.tone = "̉"; c_plain = 'ư'; break; case 'ữ': ipa.tone = "̃"; c_plain = 'ư'; toneclass = 2;  break; case 'ự': ipa.tone = "̣"; c_plain = 'ư'; toneclass = 2; break;
            case 'ý': ipa.tone = "́"; c_plain = 'y'; break; case 'ỳ': ipa.tone = "̀"; c_plain = 'y'; toneclass = 2; break; case 'ỷ': ipa.tone = "̉"; c_plain = 'y'; break; case 'ỹ': ipa.tone = "̃"; c_plain = 'y'; toneclass = 2;  break; case 'ỵ': ipa.tone = "̣"; c_plain = 'y'; toneclass = 2; break;
            case '̱': c_plain = ""; ipa.tone = "̱"; toneclass = 2; break;
            default: c_plain = c; break;
        }
        if (c_plain != c) {
            ipa.rime = ipa.rime.substr(0, i) + c_plain + ipa.rime.substr(i + 1);
            break;
        }
    }
    var deadcons = ipa.rime.slice(ipa.rime.length - 1);

    if (ipa.tone == "") {
        ipa.tone = "0";
    }
    if (ipa.onset == "") {
        ipa.onset = "ʔ";
    }
    if (toneclass == 2) {
        ipa.onset += "`";
    }
    if (ipa.rime.startsWith("oa") || ipa.rime.startsWith("oă") || ipa.rime.startsWith("uâ") || ipa.rime.startsWith("oe") || ipa.rime.startsWith("uê") || ipa.rime.startsWith("uy") || ipa.rime.startsWith("uơ")) {
        ipa.glide = "ꪫ";
        ipa.rime = ipa.rime.substring(1);
    }
    if ((ipa.onset == "kw")) {
        ipa.onset = "k";
        ipa.glide = "ꪫ";
    }
    else if ((ipa.onset == "kw`")) {
        ipa.onset = "k`";
        ipa.glide = "ꪫ";
    }
    ipa.onset = ipa.onset.replace("gh", "g");
    if ((ipa.onset == "c") || (ipa.onset == "c`"))
        ipa.onset = ipa.onset.replace("c", "k");
    if ((ipa.glide == "ꪫ") && ((ipa.rime == "e") || (ipa.rime == "ê"))) {
        ipa.rime += "`";
    }
    if ("ptk".includes(deadcons)) {
        if (ipa.rime.startsWith("a") || ipa.rime.startsWith("oa") || ipa.rime.startsWith("e") || ipa.rime.startsWith("oe") || ipa.rime.startsWith("ia") || ipa.rime.startsWith("iê") || ipa.rime.startsWith("ua") || ipa.rime.startsWith("uô") || ipa.rime.startsWith("ii") || ipa.rime.startsWith("uyi") || ipa.rime.startsWith("uu") || ipa.rime.startsWith("ưư") || ipa.rime.startsWith("ơ") || ipa.rime.startsWith("uơ") || ipa.rime.startsWith("ôô") || ipa.rime.startsWith("êê") || ipa.rime.startsWith("uêê") || ipa.rime.startsWith("ưa") || ipa.rime.startsWith("ươ")) {
            ipa.tone += "5";
        } else {
            ipa.tone += "4";
        }
    }
	
    ipaSQL = ipadb.exec("SELECT phone FROM TaiDaeng where roman='" + ipa.rime + "' ");
    if (ipaSQL.length > 0)
        ipa.rime = ipaSQL[0].values[0] + "";
    else
        return w;

    ipaSQL = ipadb.exec("SELECT phone FROM TaiDaeng where roman='" + ipa.onset + "' ");
    if (ipaSQL.length > 0)
        ipa.onset = ipaSQL[0].values[0] + ipa.glide;
    else
        return w;
    ipaSQL = ipadb.exec("SELECT phone FROM TaiDaeng where roman='" + ipa.tone + "' ");
    if (ipaSQL.length > 0) {
        ipa.tone = ipaSQL[0].values[0] + "";
        ipa.tone = ipa.tone.replace('0', '').replace('1', '').replace('2', '').replace('4', '').replace('5', '').replace('ˀ', '');
    }
    else
        return w;

    var res = ("" + ipa.rime.replace('◌', ipa.onset + ipa.tone)).replace("꪿ꫂ", "ꫂ꪿").replace("꫁ꫂ", "ꫂ꫁").replace("꪿ꫀ", "ꫀ꪿").replace("꫁ꫀ", "ꫀ꫁").replace("꪿ꪲꪲ", "ꪲꪲ꪿").replace("꪿ꪳꪳ", "ꪳꪳ꪿").replace("ꪴꪴ꪿", "ꪴꪴ꪿").replace("꫁ꪲꪲ", "ꪲꪲ꫁").replace("꫁ꪳꪳ", "ꪳꪳ꫁").replace("ꪴꪴ꫁", "ꪴꪴ꫁").replace("꪿ꪰ", "ꪰ꪿").replace("꫁ꪰ", "ꪰ꫁").replace("꪿ꪲ", "ꪲ꪿").replace("꫁ꪲ", "ꪲ꫁").replace("꪿ꪳ", "ꪳ꪿").replace("꫁ꪳ", "ꪳ꫁").replace("꪿ꪸ", "ꪸ꪿").replace("꫁ꪸ", "ꪸ꫁").replace("꪿ꪷ", "ꪷ꪿").replace("꫁ꪷ", "ꪷ꫁").replace("ꪴ꪿", "ꪴ꪿").replace("ꪴ꫁", "ꪴ꫁").replace("꪿ꪾ", "ꪾ꪿").replace("꫁ꪾ", "ꪾ꫁");
    return res;
}

function TaiDamRoma(w) {
    var ipa = {};
    ipa.onset = "", ipa.rime = "", ipa.tone = "", ipa.glide = "";
    var toneclass = 1;
    w = w.replace("qu", "kw");
    for (var i = 0; i < w.length; i++) {
        var c = w.charAt(i);
        if ("qrtpsdđfghjklzxcvbnmw".includes(c)) {
            ipa.onset += c;
        }
        else {
            ipa.rime = w.substring(i);
            break;
        }
    }

    for (var i = 0; i < ipa.rime.length; i++) {
        var c = ipa.rime.charAt(i);
        var c_plain = "";
        switch (c) {
            case 'á': ipa.tone = "́"; c_plain = 'a'; break; case 'à': ipa.tone = "̀"; c_plain = 'a'; toneclass = 2; break; case 'ả': ipa.tone = "̉"; c_plain = 'a'; break; case 'ã': ipa.tone = "̃"; c_plain = 'a'; toneclass = 2; break; case 'ạ': ipa.tone = "̣"; c_plain = 'a'; toneclass = 2; break;
            case 'ấ': ipa.tone = "́"; c_plain = 'â'; break; case 'ầ': ipa.tone = "̀"; c_plain = 'â'; toneclass = 2; break; case 'ẩ': ipa.tone = "̉"; c_plain = 'â'; break; case 'ẫ': ipa.tone = "̃"; c_plain = 'â'; toneclass = 2; break; case 'ậ': ipa.tone = "̣"; c_plain = 'â'; toneclass = 2; break;
            case 'ắ': ipa.tone = "́"; c_plain = 'ă'; break; case 'ằ': ipa.tone = "̀"; c_plain = 'ă'; toneclass = 2; break; case 'ẳ': ipa.tone = "̉"; c_plain = 'ă'; break; case 'ẵ': ipa.tone = "̃"; c_plain = 'ă'; toneclass = 2; break; case 'ặ': ipa.tone = "̣"; c_plain = 'ă'; toneclass = 2; break;
            case 'é': ipa.tone = "́"; c_plain = 'e'; break; case 'è': ipa.tone = "̀"; c_plain = 'e'; toneclass = 2; break; case 'ẻ': ipa.tone = "̉"; c_plain = 'e'; break; case 'ẽ': ipa.tone = "̃"; c_plain = 'e'; toneclass = 2; break; case 'ẹ': ipa.tone = "̣"; c_plain = 'e'; toneclass = 2; break;
            case 'ế': ipa.tone = "́"; c_plain = 'ê'; break; case 'ề': ipa.tone = "̀"; c_plain = 'ê'; toneclass = 2; break; case 'ể': ipa.tone = "̉"; c_plain = 'ê'; break; case 'ễ': ipa.tone = "̃"; c_plain = 'ê'; toneclass = 2; break; case 'ệ': ipa.tone = "̣"; c_plain = 'ê'; toneclass = 2; break;
            case 'í': ipa.tone = "́"; c_plain = 'i'; break; case 'ì': ipa.tone = "̀"; c_plain = 'i'; toneclass = 2; break; case 'ỉ': ipa.tone = "̉"; c_plain = 'i'; break; case 'ĩ': ipa.tone = "̃"; c_plain = 'i'; toneclass = 2; break; case 'ị': ipa.tone = "̣"; c_plain = 'i'; toneclass = 2; break;
            case 'ó': ipa.tone = "́"; c_plain = 'o'; break; case 'ò': ipa.tone = "̀"; c_plain = 'o'; toneclass = 2; break; case 'ỏ': ipa.tone = "̉"; c_plain = 'o'; break; case 'õ': ipa.tone = "̃"; c_plain = 'o'; toneclass = 2; break; case 'ọ': ipa.tone = "̣"; c_plain = 'o'; toneclass = 2; break;
            case 'ố': ipa.tone = "́"; c_plain = 'ô'; break; case 'ồ': ipa.tone = "̀"; c_plain = 'ô'; toneclass = 2; break; case 'ổ': ipa.tone = "̉"; c_plain = 'ô'; break; case 'ỗ': ipa.tone = "̃"; c_plain = 'ô'; toneclass = 2; break; case 'ộ': ipa.tone = "̣"; c_plain = 'ô'; toneclass = 2; break;
            case 'ớ': ipa.tone = "́"; c_plain = 'ơ'; break; case 'ờ': ipa.tone = "̀"; c_plain = 'ơ'; toneclass = 2; break; case 'ở': ipa.tone = "̉"; c_plain = 'ơ'; break; case 'ỡ': ipa.tone = "̃"; c_plain = 'ơ'; toneclass = 2; break; case 'ợ': ipa.tone = "̣"; c_plain = 'ơ'; toneclass = 2; break;
            case 'ú': ipa.tone = "́"; c_plain = 'u'; break; case 'ù': ipa.tone = "̀"; c_plain = 'u'; toneclass = 2; break; case 'ủ': ipa.tone = "̉"; c_plain = 'u'; break; case 'ũ': ipa.tone = "̃"; c_plain = 'u'; toneclass = 2; break; case 'ụ': ipa.tone = "̣"; c_plain = 'u'; toneclass = 2; break;
            case 'ứ': ipa.tone = "́"; c_plain = 'ư'; break; case 'ừ': ipa.tone = "̀"; c_plain = 'ư'; toneclass = 2; break; case 'ử': ipa.tone = "̉"; c_plain = 'ư'; break; case 'ữ': ipa.tone = "̃"; c_plain = 'ư'; toneclass = 2; break; case 'ự': ipa.tone = "̣"; c_plain = 'ư'; toneclass = 2; break;
            case 'ý': ipa.tone = "́"; c_plain = 'y'; break; case 'ỳ': ipa.tone = "̀"; c_plain = 'y'; toneclass = 2; break; case 'ỷ': ipa.tone = "̉"; c_plain = 'y'; break; case 'ỹ': ipa.tone = "̃"; c_plain = 'y'; toneclass = 2; break; case 'ỵ': ipa.tone = "̣"; c_plain = 'y'; toneclass = 2; break;
            default: c_plain = c; break;
        }
        if (c_plain != c) {
            ipa.rime = ipa.rime.substr(0, i) + c_plain + ipa.rime.substr(i + 1);
            break;
        }
    }
    var deadcons = ipa.rime.slice(ipa.rime.length - 1)
    if ("c".includes(deadcons)) {
        ipa.tone += "4";
		ipa.rime += "`";
	}
    if ("k".includes(deadcons))
        ipa.tone += "ˀ";
    if ("h".includes(deadcons)) {
        if ("ch".includes(ipa.rime.slice(ipa.rime.length - 2))) {
			deadcons = "ch";
			ipa.tone += "4";
			ipa.rime += "`";
		}
	}

    if (ipa.tone == "") {
        ipa.tone = "0";
    }
    if (ipa.onset == "") {
        ipa.onset = "ʔ";
    }
    if (toneclass == 2) {
        ipa.onset += "`";
    }
    if (ipa.rime.startsWith("oa") || ipa.rime.startsWith("oă") || ipa.rime.startsWith("uâ") || ipa.rime.startsWith("oe") || ipa.rime.startsWith("uê") || ipa.rime.startsWith("uy") || ipa.rime.startsWith("uơ")) {
        ipa.glide = "ꪫ";
        ipa.rime = ipa.rime.substring(1);
    }
    if ((ipa.onset == "kw")) {
        ipa.onset = "k";
        ipa.glide = "ꪫ";
    }
    else if ((ipa.onset == "kw`")) {
        ipa.onset = "k`";
        ipa.glide = "ꪫ";
    }
    ipa.onset = ipa.onset.replace("gh", "g");
    if ((ipa.onset == "c") || (ipa.onset == "c`"))
        ipa.onset = ipa.onset.replace("c", "k");
    if ((ipa.glide == "ꪫ") && ((ipa.rime == "e") || (ipa.rime == "ê"))) {
        ipa.rime += "`";
    }
	
    if ("pt".includes(deadcons)) {
	  if (ipa.tone=="̣") {
        if ((ipa.rime.startsWith("ă") || ipa.rime.startsWith("oă") || ipa.rime.startsWith("ê") || ipa.rime.startsWith("uê") || ipa.rime.startsWith("uy") || ipa.rime.startsWith("i") || ipa.rime.startsWith("ô") || ipa.rime.startsWith("u") || ipa.rime.startsWith("ư") || ipa.rime.startsWith("uơ") || ipa.rime.startsWith("ơ")) && !ipa.rime.startsWith("ươ") && !ipa.rime.startsWith("iê") && !ipa.rime.startsWith("yê") && !ipa.rime.startsWith("uô")) {
            ipa.tone += "4";
			ipa.rime += "`";
        } else {
            ipa.tone += "5";
        }
	  } else if (ipa.tone=="́") {
            ipa.tone += "4";
			ipa.rime += "`";
	  } else {
            ipa.tone += "5";
        }
    }
	
    ipaSQL = ipadb.exec("SELECT phone FROM TaiDam where roman='" + ipa.rime + "' ");
    if (ipaSQL.length > 0)
        ipa.rime = ipaSQL[0].values[0] + "";
    else
        return w;
    if ("c".includes(deadcons) || "ch".includes(deadcons)) {
        if (toneclass == 1)
            ipa.rime = ipa.rime.replace('̽', '꪿');
        else
            ipa.rime = ipa.rime.replace('̽', '꫁');
    }
    if ("pt".includes(deadcons)) {
        if (toneclass == 1)
            ipa.rime = ipa.rime.replace('̽', '꪿');
        else
            ipa.rime = ipa.rime.replace('̽', '');
    }

    ipaSQL = ipadb.exec("SELECT phone FROM TaiDam where roman='" + ipa.onset + "' ");
    if (ipaSQL.length > 0)
        ipa.onset = ipaSQL[0].values[0] + ipa.glide;
    else
        return w;
    ipaSQL = ipadb.exec("SELECT phone FROM TaiDam where roman='" + ipa.tone + "' ");
    if (ipaSQL.length > 0) {
        ipa.tone = ipaSQL[0].values[0] + "";
        ipa.tone = ipa.tone.replace('0', '').replace('1', '').replace('2', '').replace('4', '').replace('5', '').replace('ˀ', '');
    }
    else
        return w;

    var res = ("" + ipa.rime.replace('◌', ipa.onset + ipa.tone)).replace("꪿ꪰ", "ꪰ꪿").replace("꫁ꪰ", "ꪰ꫁").replace("꪿ꪲ", "ꪲ꪿").replace("꫁ꪲ", "ꪲ꫁").replace("꪿ꪳ", "ꪳ꪿").replace("꫁ꪳ", "ꪳ꫁").replace("꪿ꪸ", "ꪸ꪿").replace("꫁ꪸ", "ꪸ꫁").replace("꪿ꪷ", "ꪷ꪿").replace("꫁ꪷ", "ꪷ꫁").replace("ꪴ꪿", "ꪴ꪿").replace("ꪴ꫁", "ꪴ꫁").replace("꪿ꪾ", "ꪾ꪿").replace("꫁ꪾ", "ꪾ꫁");
    return res;
}

function TaiPaoRoma(w) {
    var ipa = {};
    ipa.onset = "", ipa.rime = "", ipa.tone = "", ipa.glide = "";
    var toneclass = 1;
    for (var i = 0; i < w.length; i++) {
        var c = w.charAt(i);
        if ("qrtpsdđfghjklzxcvbnmy".includes(c)) {
            ipa.onset += c;
        }
        else {
            ipa.rime = w.substring(i);
            break;
        }
    }

    for (var i = 0; i < ipa.rime.length; i++) {
        var c = ipa.rime.charAt(i);
        var c_plain = "";
        switch (c) {
            case 'á': ipa.tone = "́"; c_plain = 'a'; break; case 'à': ipa.tone = "̀"; c_plain = 'a'; toneclass = 2; break; case 'ǎ': ipa.tone = "̌"; c_plain = 'a'; toneclass = 2; break; case 'ā': ipa.tone = "̄"; c_plain = 'a'; toneclass = 2; break; case 'ạ': ipa.tone = "̣"; c_plain = 'a'; break;
            case 'ấ': ipa.tone = "́"; c_plain = 'â'; break; case 'ầ': ipa.tone = "̀"; c_plain = 'â'; toneclass = 2; break; case 'ậ': ipa.tone = "̣"; c_plain = 'â'; break;
            case 'ắ': ipa.tone = "́"; c_plain = 'ă'; break; case 'ằ': ipa.tone = "̀"; c_plain = 'ă'; toneclass = 2; break; case 'ặ': ipa.tone = "̣"; c_plain = 'ă'; break;
            case 'é': ipa.tone = "́"; c_plain = 'e'; break; case 'è': ipa.tone = "̀"; c_plain = 'e'; toneclass = 2; break; case 'ě': ipa.tone = "̌"; c_plain = 'e'; toneclass = 2; break; case 'ē': ipa.tone = "̄"; c_plain = 'e'; toneclass = 2; break; case 'ẹ': ipa.tone = "̣"; c_plain = 'e'; break;
            case 'ế': ipa.tone = "́"; c_plain = 'ê'; break; case 'ề': ipa.tone = "̀"; c_plain = 'ê'; toneclass = 2; break; case 'ệ': ipa.tone = "̣"; c_plain = 'ê'; break;
            case 'í': ipa.tone = "́"; c_plain = 'i'; break; case 'ì': ipa.tone = "̀"; c_plain = 'i'; toneclass = 2; break; case 'ǐ': ipa.tone = "̌"; c_plain = 'i'; toneclass = 2; break; case 'ī': ipa.tone = "̄"; c_plain = 'i'; toneclass = 2; break; case 'ị': ipa.tone = "̣"; c_plain = 'i'; break;
            case 'ó': ipa.tone = "́"; c_plain = 'o'; break; case 'ò': ipa.tone = "̀"; c_plain = 'o'; toneclass = 2; break; case 'ǒ': ipa.tone = "̌"; c_plain = 'o'; toneclass = 2; break; case 'ō': ipa.tone = "̄"; c_plain = 'o'; toneclass = 2; break; case 'ọ': ipa.tone = "̣"; c_plain = 'o'; break;
            case 'ố': ipa.tone = "́"; c_plain = 'ô'; break; case 'ồ': ipa.tone = "̀"; c_plain = 'ô'; toneclass = 2; break; case 'ộ': ipa.tone = "̣"; c_plain = 'ô'; break;
            case 'ớ': ipa.tone = "́"; c_plain = 'ơ'; break; case 'ờ': ipa.tone = "̀"; c_plain = 'ơ'; toneclass = 2; break; case 'ợ': ipa.tone = "̣"; c_plain = 'ơ'; break;
            case 'ú': ipa.tone = "́"; c_plain = 'u'; break; case 'ù': ipa.tone = "̀"; c_plain = 'u'; toneclass = 2; break; case 'ǔ': ipa.tone = "̌"; c_plain = 'u'; toneclass = 2; break; case 'ū': ipa.tone = "̄"; c_plain = 'u'; toneclass = 2; break; case 'ụ': ipa.tone = "̣"; c_plain = 'u'; break;
            case 'ứ': ipa.tone = "́"; c_plain = 'ư'; break; case 'ừ': ipa.tone = "̀"; c_plain = 'ư'; toneclass = 2; break; case 'ự': ipa.tone = "̣"; c_plain = 'ư'; break;
            case 'ý': ipa.tone = "́"; c_plain = 'y'; break; case 'ỳ': ipa.tone = "̀"; c_plain = 'y'; toneclass = 2; break; case 'y̌': ipa.tone = "̌"; c_plain = 'y'; toneclass = 2; break; case 'ȳ': ipa.tone = "̄"; c_plain = 'y'; toneclass = 2; break; case 'ỵ': ipa.tone = "̣"; c_plain = 'y'; break;
            case '̄': c_plain = ""; ipa.tone = "̄"; toneclass = 2; break;
            case '̌': c_plain = ""; ipa.tone = "̌"; toneclass = 2; break;
            default: c_plain = c; break;
        }
        if (c_plain != c) {
            ipa.rime = ipa.rime.substr(0, i) + c_plain + ipa.rime.substr(i + 1);
            break;
        }
    }
    var deadcons = ipa.rime.slice(ipa.rime.length - 1)
    if ("pkt".includes(deadcons) || (ipa.rime.slice(ipa.rime.length - 2) == "ch"))
        ipa.tone += "ˀ";

    if (ipa.tone == "") {
        ipa.tone = "0";
    }
    if (ipa.onset == "") {
        ipa.onset = "ʔ";
    }
    if (toneclass == 2) {
        ipa.onset += "`";
    }
    if (ipa.rime[0] == "w") {
        ipa.glide = "𕉻";
        ipa.rime = ipa.rime.substring(1);
    }

    ipaSQL = ipadb.exec("SELECT phone FROM TaiPao where roman='" + ipa.rime + "' ");
    if (ipaSQL.length > 0)
        ipa.rime = ipaSQL[0].values[0] + "";
    else
        return w;

    if ("𕊀𕊉𕊈𕊄𕊂𕊃𕊇".includes([...ipa.rime][0]) && ![...ipa.rime].includes('𕊑')) {
        if (ipa.tone == "̣ˀ") {
            toneclass = 2;
            ipa.onset += "`";
        } else if (ipa.tone == "̄ˀ") {
            toneclass = 1;
            ipa.onset = ipa.onset.replace('`', '');
        }
    }
	if ([...ipa.rime].includes('𕊑') && (ipa.tone == "̄ˀ")) {
            toneclass = 1;
            ipa.onset = ipa.onset.replace('`', '');
			ipa.rime = ipa.rime.replace("𕊑", "");
	}

    ipaSQL = ipadb.exec("SELECT phone FROM TaiPao where roman='" + ipa.onset + "' ");
    if (ipaSQL.length > 0)
        ipa.onset = ipaSQL[0].values[0] + ipa.glide;
    else
        return w;
    ipaSQL = ipadb.exec("SELECT phone FROM TaiPao where roman='" + ipa.tone + "' ");
    if (ipaSQL.length > 0) {
        ipa.tone = ipaSQL[0].values[0] + "";
        ipa.tone = ipa.tone.replace('0', '').replace('1', '').replace('2', '').replace('4', '').replace('5', '');
    }
    else
        return w;

    var res = ("" + ipa.onset + ipa.tone + ipa.rime).replace("𕊑𕊂", "𕊂𕊑").replace("𕊑𕊄", "𕊄𕊑").replace("𕊑𕊃", "𕊃𕊑").replace("𕊑𕊋", "𕊋𕊑").replace("𕊑𕊖", "𕊖𕊑").replace("𕊑𕊔", "𕊔𕊑").replace("𕊑𕊉", "𕊉𕊑").replace("𕊑𕊕", "𕊕𕊑").replace("𕊑𕊇", "𕊇𕊑").replace("𕊑𕊀", "𕊀𕊑").replace("𕊑𕊜", "𕊜𕊑").replace("𕊒𕊂", "𕊂𕊒").replace("𕊒𕊄", "𕊄𕊒").replace("𕊒𕊃", "𕊃𕊒").replace("𕊒𕊋", "𕊋𕊒").replace("𕊒𕊖", "𕊖𕊒").replace("𕊒𕊔", "𕊔𕊒").replace("𕊒𕊉", "𕊉𕊒").replace("𕊒𕊀", "𕊀𕊒").replace("𕊒𕊇", "𕊇𕊒").replace("𕊒𕊕", "𕊕𕊒").replace("𕊒𕊜", "𕊜𕊒");
    return res;
}

function TaiYoIPA(w, accent) {
    var ipastr = "";
    var ipa = {};
    var tmpconso = "";
    ipa.onset = "", ipa.onset2 = "", ipa.rime = "", ipa.tone = "", ipa.toneclass = 0;
    var ipalist = [];
    w = w.replace('𞛾', '𞛖𞛪𞛅');
    for (var i = 0; i < [...w].length; i++) {
        var c = [...w][i];
        if ("𞛗𞛋𞛐𞛜𞛝𞛑𞛀𞛂𞛚𞛄𞛆𞛉𞛌𞛎𞛇𞜆𞛓𞛔𞜈𞜊𞛞𞛁𞛃𞛅𞛛𞛻𞜅𞛟𞛊𞛺𞛸𞛍𞛶𞛏𞛈𞜇𞛘𞛹𞛒𞛷𞛖𞛕𞛙𞜉𞜋".includes(c)) {
            if (ipa.onset == "") {
                ipa.onset = c;
                if ("𞛝𞛑𞛀𞛂𞛚𞛄𞛆𞛉𞛌𞛎𞛇𞜆𞛓𞛔𞜈𞜊".includes(c))
                    ipa.toneclass = 1;
                else if ("𞛞𞛁𞛃𞛅𞛛𞛻𞜅𞛟𞛊𞛺𞛸𞛍𞛶𞛏𞛈𞜇𞛘𞛹𞛒𞛷𞛖𞛕𞛙𞜉𞜋".includes(c))
                    ipa.toneclass = 2;
                else if ("𞛗𞛋𞛐𞛜".includes(c))
                    ipa.toneclass = 3;
            }
            else if ((ipa.rime == "") && (ipa.tone == "") && (ipa.onset == "𞛚") && ("𞛘𞛙𞛖𞛏𞛅".includes(c))) {
                ipa.onset += c;
            }
            else if ((ipa.rime == "") && (ipa.tone == "") && ("𞛁𞛂𞛃𞛄𞜅𞛅𞛚𞛅".includes(ipa.onset)) && (c == "𞛙") && (!ipa.onset2.endsWith("1"))) {
                c = "𞛙1";
                ipa.onset2 += c;
            }
            else if ((ipa.rime != "") && ("𞛀𞛋𞛐".includes(c)) && (!"𞛵𞛦𞛮".includes(ipa.rime))) {
                tmpconso = c;
                if ("𞛧𞛡𞛨𞛤𞛣𞛭𞛮𞛡𞛮𞛨".includes(ipa.rime) && ipa.tone != "𞛼")
                    ipa.tone = "5";
				else if (ipa.tone != "𞛼") {
                    ipa.tone = "5";
					ipa.rime = "𞛼" + ipa.rime;
				}
                else {
                    ipa.rime = ipa.tone + ipa.rime;
                    ipa.tone = "4";
                }
                ipa.rime += c;

                ipalist.push(Object.assign({}, ipa));
                ipa.onset = "";
                ipa.onset2 = "";
                ipa.rime = "";
                ipa.tone = "";
                ipa.toneclass = 0;
                continue;
            }
            else if ((ipa.rime != "") && ("𞛉𞛙𞛅𞛏𞛖".includes(c)) && (!"𞛵𞛦𞛮".includes(ipa.rime))) {
                tmpconso = c;
                if (ipa.tone == "") {
                    ipa.tone = "0";
                }
                if (ipa.onset == "") {
                    ipa.onset = "∅";
                }
                ipa.rime += c;

                ipalist.push(Object.assign({}, ipa));
                ipa.onset = "";
                ipa.onset2 = "";
                ipa.rime = "";
                ipa.tone = "";
                ipa.toneclass = 0;
                continue;
            }
            else {
                tmpconso = "";
                if (ipa.tone == "") {
                    ipa.tone = "0";
                }
                if (ipa.rime == "") {
                    ipa.rime = "◌";
                }

                ipalist.push(Object.assign({}, ipa));
                ipa.onset = "";
                ipa.onset2 = "";
                ipa.rime = "";
                ipa.tone = "";
                ipa.toneclass = 0;
                i--;
                continue;
            }
        }
        else if (((ipa.rime == "") || (ipa.rime == "𞛮")) && ("𞛳𞛴𞛲".includes(c))) {
            ipa.tone = "5";
            ipa.rime += c;
        }
        else if ("𞛼𞛽".includes(c)) {
            ipa.tone = c;
        }
        else {
            if (ipa.onset == "") {
                if ("𞛗𞛋𞛐𞛜𞛝𞛑𞛀𞛂𞛚𞛄𞛆𞛉𞛌𞛎𞛇𞜆𞛓𞛔𞜈𞜊𞛞𞛁𞛃𞛅𞛛𞛻𞜅𞛟𞛊𞛺𞛸𞛍𞛶𞛏𞛈𞜇𞛘𞛹𞛒𞛷𞛖𞛕𞛙𞜉𞜋".includes(tmpconso)) {
                    tmpconso = "";
                    var previpa = ipalist.pop();
                    previpa.rime = [...previpa.rime].slice(0, -1);
                    if (previpa.tone == "4")
                        previpa.tone = "0";
                    ipalist.push(Object.assign({}, previpa));
                    ipa.onset = "";
                    ipa.onset2 = "";
                    ipa.rime = "";
                    ipa.tone = "";
                    ipa.toneclass = 0;
                    i -= 2;
                    continue;
                }
                else {
                    tmpconso = "";
                    ipa.onset = "∅";
                }
            }
            ipa.rime += c;
        }
    }

    if (ipa.tone == "") {
        ipa.tone = "0";
    }
    if (ipa.rime == "") {
        ipa.rime = "◌";
    }
    if (ipa.onset == "") {
        ipa.onset = "∅";
        if (ipalist.length == 0)
            ipalist.push(Object.assign({}, ipa));
    }
    else
        ipalist.push(Object.assign({}, ipa));

    while (ipalist.length != 0) {
        var ipatmp = ipalist.pop();

        if (ipatmp.toneclass == 3) {
            if ((accent == "ChauLi") && (ipatmp.tone == 0))
                ipatmp.toneclass = 2;
            else
                ipatmp.toneclass = 1;
        }

        ipaSQL = ipadb.exec("SELECT " + accent + " FROM TaiYo where phone='" + ipatmp.onset + "' ");
        if (ipaSQL.length > 0)
            ipatmp.onset = ipaSQL[0].values[0];
        else {
            ipastr = (" ∅") + ipastr;
            continue;
        }
        if (ipatmp.onset2 != "") {
            ipaSQL = ipadb.exec("SELECT " + accent + " FROM TaiYo where phone='" + ipatmp.onset2 + "' ");
            if (ipaSQL.length > 0)
                ipatmp.onset += ipaSQL[0].values[0];
            else {
                ipastr = (" ∅") + ipastr;
                continue;
            }
        }
        ipaSQL = ipadb.exec("SELECT " + accent + " FROM TaiYo where phone='" + ipatmp.rime + "' ");
        if (ipaSQL.length > 0)
            ipatmp.rime = ipaSQL[0].values[0];
        else {
            ipastr = (" ∅") + ipastr;
            continue;
        }
        ipaSQL = ipadb.exec("SELECT " + accent + " FROM TaiYo where phone='" + ipatmp.tone + ipatmp.toneclass + "' ");
        if (ipaSQL.length > 0)
            ipatmp.tone = ipaSQL[0].values[0];
        else {
            ipastr = (" ∅") + ipastr;
            continue;
        }

        if (accent == "roman") {
            ipatmp.onset = (ipatmp.onset + "").replace('`', '');
            ipastr = " " + ipatmp.onset.replace('ʔ','') + TaiYorimetone(ipatmp.rime[0], ipatmp.tone[0].replace('ˀ', '')) + ipastr;
        }
        else
            ipastr = " " + ipatmp.onset + ipatmp.rime + ipatmp.tone + ipastr;
    }

    return (ipastr.substring(1));
}

function TaiYoRoma(w) {
    var ipa = {};
    ipa.onset = "", ipa.rime = "", ipa.tone = "", ipa.glide = "";
    var toneclass = 1;
    for (var i = 0; i < w.length; i++) {
        var c = w.charAt(i);
        if ("qrtpsdđfghjklzxcvbnmy".includes(c)) {
            ipa.onset += c;
        }
        else {
            ipa.rime = w.substring(i);
            break;
        }
    }

    for (var i = 0; i < ipa.rime.length; i++) {
        var c = ipa.rime.charAt(i);
        var c_plain = "";
        switch (c) {
            case 'á': ipa.tone = "́"; c_plain = 'a'; break; case 'à': ipa.tone = "̀"; c_plain = 'a'; toneclass = 2; break; case 'ǎ': ipa.tone = "̌"; c_plain = 'a'; toneclass = 2; break; case 'ā': ipa.tone = "̄"; c_plain = 'a'; toneclass = 2; break; case 'ạ': ipa.tone = "̣"; c_plain = 'a'; break;
            case 'ấ': ipa.tone = "́"; c_plain = 'â'; break; case 'ầ': ipa.tone = "̀"; c_plain = 'â'; toneclass = 2; break;    case 'ậ': ipa.tone = "̣"; c_plain = 'â'; break;
            case 'ắ': ipa.tone = "́"; c_plain = 'ă'; break; case 'ằ': ipa.tone = "̀"; c_plain = 'ă'; toneclass = 2; break;    case 'ặ': ipa.tone = "̣"; c_plain = 'ă'; break;
            case 'é': ipa.tone = "́"; c_plain = 'e'; break; case 'è': ipa.tone = "̀"; c_plain = 'e'; toneclass = 2; break; case 'ě': ipa.tone = "̌"; c_plain = 'e'; toneclass = 2; break; case 'ē': ipa.tone = "̄"; c_plain = 'e'; toneclass = 2; break; case 'ẹ': ipa.tone = "̣"; c_plain = 'e'; break;
            case 'ế': ipa.tone = "́"; c_plain = 'ê'; break; case 'ề': ipa.tone = "̀"; c_plain = 'ê'; toneclass = 2; break;    case 'ệ': ipa.tone = "̣"; c_plain = 'ê'; break;
            case 'í': ipa.tone = "́"; c_plain = 'i'; break; case 'ì': ipa.tone = "̀"; c_plain = 'i'; toneclass = 2; break; case 'ǐ': ipa.tone = "̌"; c_plain = 'i'; toneclass = 2; break; case 'ī': ipa.tone = "̄"; c_plain = 'i'; toneclass = 2; break; case 'ị': ipa.tone = "̣"; c_plain = 'i'; break;
            case 'ó': ipa.tone = "́"; c_plain = 'o'; break; case 'ò': ipa.tone = "̀"; c_plain = 'o'; toneclass = 2; break; case 'ǒ': ipa.tone = "̌"; c_plain = 'o'; toneclass = 2; break; case 'ō': ipa.tone = "̄"; c_plain = 'o'; toneclass = 2; break; case 'ọ': ipa.tone = "̣"; c_plain = 'o'; break;
            case 'ố': ipa.tone = "́"; c_plain = 'ô'; break; case 'ồ': ipa.tone = "̀"; c_plain = 'ô'; toneclass = 2; break;    case 'ộ': ipa.tone = "̣"; c_plain = 'ô'; break;
            case 'ớ': ipa.tone = "́"; c_plain = 'ơ'; break; case 'ờ': ipa.tone = "̀"; c_plain = 'ơ'; toneclass = 2; break;    case 'ợ': ipa.tone = "̣"; c_plain = 'ơ'; break;
            case 'ú': ipa.tone = "́"; c_plain = 'u'; break; case 'ù': ipa.tone = "̀"; c_plain = 'u'; toneclass = 2; break; case 'ǔ': ipa.tone = "̌"; c_plain = 'u'; toneclass = 2; break; case 'ū': ipa.tone = "̄"; c_plain = 'u'; toneclass = 2; break; case 'ụ': ipa.tone = "̣"; c_plain = 'u'; break;
            case 'ứ': ipa.tone = "́"; c_plain = 'ư'; break; case 'ừ': ipa.tone = "̀"; c_plain = 'ư'; toneclass = 2; break;    case 'ự': ipa.tone = "̣"; c_plain = 'ư'; break;
            case 'ý': ipa.tone = "́"; c_plain = 'y'; break; case 'ỳ': ipa.tone = "̀"; c_plain = 'y'; toneclass = 2; break; case 'y̌': ipa.tone = "̌"; c_plain = 'y'; toneclass = 2; break; case 'ȳ': ipa.tone = "̄"; c_plain = 'y'; toneclass = 2; break; case 'ỵ': ipa.tone = "̣"; c_plain = 'y'; break;
            case '̄': c_plain = ""; ipa.tone = "̄"; toneclass = 2; break;
            case '̌': c_plain = ""; ipa.tone = "̌"; toneclass = 2; break;
            default: c_plain = c; break;
        }
        if (c_plain != c) {
            ipa.rime = ipa.rime.substr(0, i) + c_plain + ipa.rime.substr(i + 1);
            break;
        }
    }
    var deadcons = ipa.rime.slice(ipa.rime.length - 1)
    if ("pkt".includes(deadcons) || (ipa.rime.slice(ipa.rime.length - 2) == "ch"))
        ipa.tone += "ˀ";

    if (ipa.tone == "") {
        ipa.tone = "0";
    }
    if (ipa.onset == "") {
        ipa.onset = "ʔ";
    }
    if (toneclass == 2) {
        ipa.onset += "`";
    }
    if (ipa.rime[0] == "w") {
        if (ipa.onset[0] == 'k') {
            ipa.onset += 'w';
			ipa.onset = ipa.onset.replace('k`w', 'kw`');
            ipa.rime = ipa.rime.substring(1);
        }
    }
    if (ipa.rime == "â") {
        ipa.rime = "ơ";
    }

    ipaSQL = ipadb.exec("SELECT phone FROM TaiYo where roman='" + ipa.rime + "' ");
    if (ipaSQL.length > 0)
        ipa.rime = ipaSQL[0].values[0] + "";
    else
        return w;

    if ("𞛧𞛡𞛨𞛤𞛣𞛭𞛳𞛴𞛲".includes([...ipa.rime][0]) || (([...ipa.rime][0]=="𞛮") &&"𞛧𞛡𞛨𞛤𞛣𞛭𞛳𞛴𞛲".includes([...ipa.rime][1]))) {
        if (ipa.tone == "̣ˀ") {
            toneclass = 2;
            ipa.onset += "`";
        } else if (ipa.tone == "̄ˀ") {
            toneclass = 1;
            ipa.onset = ipa.onset.replace('`', '');
        }
    }
	if (([...ipa.rime][0]=="𞛼") && (ipa.tone == "̄ˀ")) {
            toneclass = 1;
            ipa.onset = ipa.onset.replace('`', '');
			ipa.rime = ipa.rime.replace("𞛼", "");
	}
    if ((ipa.onset == 'khw') || (ipa.onset == 'kh`w') || (ipa.onset == 'khw`')) {
        ipa.onset = ipa.onset.replace('w','');
        ipa.rime = "𞛮" + ipa.rime;
		ipa.rime = ipa.rime.replace("𞛮𞛼", "𞛼𞛮");
    }

    ipaSQL = ipadb.exec("SELECT phone FROM TaiYo where roman='" + ipa.onset + "' ");
    if (ipaSQL.length > 0)
        ipa.onset = ipaSQL[0].values[0];
    else
        return w;
    ipaSQL = ipadb.exec("SELECT phone FROM TaiYo where roman='" + ipa.tone + "' ");
    if (ipaSQL.length > 0) {
        ipa.tone = ipaSQL[0].values[0] + "";
        ipa.tone = ipa.tone.replace('0', '').replace('1', '').replace('2', '').replace('4', '').replace('5', '');
    }
    else
        return w;
    var res = "" + ipa.onset + ipa.tone + ipa.rime.replace("◌", "");
    return res.replace("𞛖𞛪𞛅", "𞛾");
}

function TaiNueaRoma(w) {
    var ipa = {};
    ipa.onset = "", ipa.rime = "", ipa.tone = "", ipa.glide = "";
    var toneclass = 2;
    for (var i = 0; i < w.length; i++) {
        var c = w.charAt(i);
        if ("qrtpsdfghjklzxcvbnmyw".includes(c)) {
            ipa.onset += c;
        }
        else {
            ipa.tone = w.substring(w.length-1);
			ipa.rime = w.substring(i, w.length-1);
            break;
        }
    }

    var deadcons = ipa.rime.slice(ipa.rime.length - 1)
    if ("pkt".includes(deadcons)) {
        ipa.tone += "ˀ";
    }

    if (ipa.tone == "") {
        ipa.tone = "0";
    }
    if (ipa.onset == "") {
        ipa.onset = "ʔ";
    }

    ipaSQL = ipadb.exec("SELECT phone FROM TaiNuea where roman='" + ipa.tone + "' ");
    if (ipaSQL.length > 0) {
        ipa.tone = ipaSQL[0].values[0] + "";
    }
    else
        return w;
    ipaSQL = ipadb.exec("SELECT phone FROM TaiNuea where roman='" + ipa.rime + "' ");
    if (ipaSQL.length > 0)
        ipa.rime = ipaSQL[0].values[0] + "";
    else
        return w;

    ipaSQL = ipadb.exec("SELECT phone FROM TaiNuea where roman='" + ipa.onset + "' ");
    if (ipaSQL.length > 0)
        ipa.onset = ipaSQL[0].values[0] + ipa.glide;
    else
        return w;
    var res = "" + ipa.onset.replace("`", "") + ipa.rime.replace("-", "") + ipa.tone.replace('0', '').replace('4', '').replace('5', '') ;
    return res;
}

function TaiAitonRoma(w) {
    var ipa = {};
    ipa.onset = "", ipa.rime = "", ipa.tone = "", ipa.glide = "";
    var toneclass = 2;
    for (var i = 0; i < w.length; i++) {
        var c = w.charAt(i);
        if ("khŋcsyɲdtnlbpmvr".includes(c)) {
            ipa.onset += c;
        }
        else {
            ipa.tone = w.substring(w.length-1);
			ipa.rime = w.substring(i, w.length-1);
            break;
        }
    }

    var deadcons = ipa.rime.slice(ipa.rime.length - 1)
    if ("pkt".includes(deadcons)) {
        ipa.tone += "ˀ";
    }

    if (ipa.tone == "") {
        ipa.tone = "0";
    }
    if (ipa.onset == "") {
        ipa.onset = "ʔ";
    }

    ipaSQL = ipadb.exec("SELECT phone FROM TaiAiton where roman='" + ipa.tone + "' ");
    if (ipaSQL.length > 0) {
        ipa.tone = ipaSQL[0].values[0] + "";
    }
    else
        return w;
    ipaSQL = ipadb.exec("SELECT phone FROM TaiAiton where roman='" + ipa.rime + "' ");
    if (ipaSQL.length > 0)
        ipa.rime = ipaSQL[0].values[0] + "";
    else
        return w;

    ipaSQL = ipadb.exec("SELECT phone FROM TaiAiton where roman='" + ipa.onset + "' ");
    if (ipaSQL.length > 0)
        ipa.onset = ipaSQL[0].values[0] + ipa.glide;
    else
        return w;
    var res = "" + ipa.onset + ipa.rime + ipa.tone.replace('0', '').replace('4', '').replace('5', '') ;
    return res.replace("ြ်","်ြ");
}

function TaiLueRoma(w) {
    var ipa = {};
    ipa.onset = "", ipa.rime = "", ipa.tone = "", ipa.glide = "";
    var toneclass = 2;
    for (var i = 0; i < w.length; i++) {
        var c = w.charAt(i);
        if ("qrtpsdđfghjklzxcvbnmyw".includes(c)) {
            ipa.onset += c;
        }
        else {
            ipa.rime = w.substring(i);
            break;
        }
    }

    for (var i = 0; i < ipa.rime.length; i++) {
        var c = ipa.rime.charAt(i);
        var c_plain = "";
        switch (c) {
            case 'á': ipa.tone = "́"; c_plain = 'a'; toneclass = 1; break; case 'à': ipa.tone = "̀"; c_plain = 'a'; break; case 'ả': ipa.tone = "̉"; c_plain = 'a'; toneclass = 1; break; case 'ã': ipa.tone = "̃"; c_plain = 'a'; toneclass = 1; break; case 'ạ': ipa.tone = "̣"; c_plain = 'a'; break;
            case 'ấ': ipa.tone = "́"; c_plain = 'â'; toneclass = 1; break; case 'ầ': ipa.tone = "̀"; c_plain = 'â'; break; case 'ẩ': ipa.tone = "̉"; c_plain = 'â'; toneclass = 1; break; case 'ẫ': ipa.tone = "̃"; c_plain = 'â'; toneclass = 1; break; case 'ậ': ipa.tone = "̣"; c_plain = 'â'; break;
            case 'ắ': ipa.tone = "́"; c_plain = 'ă'; toneclass = 1; break; case 'ằ': ipa.tone = "̀"; c_plain = 'ă'; break; case 'ẳ': ipa.tone = "̉"; c_plain = 'ă'; toneclass = 1; break; case 'ẵ': ipa.tone = "̃"; c_plain = 'ă'; toneclass = 1; break; case 'ặ': ipa.tone = "̣"; c_plain = 'ă'; break;
            case 'é': ipa.tone = "́"; c_plain = 'e'; toneclass = 1; break; case 'è': ipa.tone = "̀"; c_plain = 'e'; break; case 'ẻ': ipa.tone = "̉"; c_plain = 'e'; toneclass = 1; break; case 'ẽ': ipa.tone = "̃"; c_plain = 'e'; toneclass = 1; break; case 'ẹ': ipa.tone = "̣"; c_plain = 'e'; break;
            case 'ế': ipa.tone = "́"; c_plain = 'ê'; toneclass = 1; break; case 'ề': ipa.tone = "̀"; c_plain = 'ê'; break; case 'ể': ipa.tone = "̉"; c_plain = 'ê'; toneclass = 1; break; case 'ễ': ipa.tone = "̃"; c_plain = 'ê'; toneclass = 1; break; case 'ệ': ipa.tone = "̣"; c_plain = 'ê'; break;
            case 'í': ipa.tone = "́"; c_plain = 'i'; toneclass = 1; break; case 'ì': ipa.tone = "̀"; c_plain = 'i'; break; case 'ỉ': ipa.tone = "̉"; c_plain = 'i'; toneclass = 1; break; case 'ĩ': ipa.tone = "̃"; c_plain = 'i'; toneclass = 1; break; case 'ị': ipa.tone = "̣"; c_plain = 'i'; break;
            case 'ó': ipa.tone = "́"; c_plain = 'o'; toneclass = 1; break; case 'ò': ipa.tone = "̀"; c_plain = 'o'; break; case 'ỏ': ipa.tone = "̉"; c_plain = 'o'; toneclass = 1; break; case 'õ': ipa.tone = "̃"; c_plain = 'o'; toneclass = 1; break; case 'ọ': ipa.tone = "̣"; c_plain = 'o'; break;
            case 'ố': ipa.tone = "́"; c_plain = 'ô'; toneclass = 1; break; case 'ồ': ipa.tone = "̀"; c_plain = 'ô'; break; case 'ổ': ipa.tone = "̉"; c_plain = 'ô'; toneclass = 1; break; case 'ỗ': ipa.tone = "̃"; c_plain = 'ô'; toneclass = 1; break; case 'ộ': ipa.tone = "̣"; c_plain = 'ô'; break;
            case 'ớ': ipa.tone = "́"; c_plain = 'ơ'; toneclass = 1; break; case 'ờ': ipa.tone = "̀"; c_plain = 'ơ'; break; case 'ở': ipa.tone = "̉"; c_plain = 'ơ'; toneclass = 1; break; case 'ỡ': ipa.tone = "̃"; c_plain = 'ơ'; toneclass = 1; break; case 'ợ': ipa.tone = "̣"; c_plain = 'ơ'; break;
            case 'ú': ipa.tone = "́"; c_plain = 'u'; toneclass = 1; break; case 'ù': ipa.tone = "̀"; c_plain = 'u'; break; case 'ủ': ipa.tone = "̉"; c_plain = 'u'; toneclass = 1; break; case 'ũ': ipa.tone = "̃"; c_plain = 'u'; toneclass = 1; break; case 'ụ': ipa.tone = "̣"; c_plain = 'u'; break;
            case 'ứ': ipa.tone = "́"; c_plain = 'ư'; toneclass = 1; break; case 'ừ': ipa.tone = "̀"; c_plain = 'ư'; break; case 'ử': ipa.tone = "̉"; c_plain = 'ư'; toneclass = 1; break; case 'ữ': ipa.tone = "̃"; c_plain = 'ư'; toneclass = 1; break; case 'ự': ipa.tone = "̣"; c_plain = 'ư'; break;
            case 'ý': ipa.tone = "́"; c_plain = 'y'; toneclass = 1; break; case 'ỳ': ipa.tone = "̀"; c_plain = 'y'; break; case 'ỷ': ipa.tone = "̉"; c_plain = 'y'; toneclass = 1; break; case 'ỹ': ipa.tone = "̃"; c_plain = 'y'; toneclass = 1; break; case 'ỵ': ipa.tone = "̣"; c_plain = 'y'; break;
            default: c_plain = c; break;
        }
        if (c_plain != c) {
            ipa.rime = ipa.rime.substr(0, i) + c_plain + ipa.rime.substr(i + 1);
            break;
        }
    }
    var deadcons = ipa.rime.slice(ipa.rime.length - 1)
    if ("pkth".includes(deadcons)) {
        ipa.tone += "ˀ";
    }

    if (ipa.tone == "") {
        ipa.tone = "0";
    }
    if (ipa.onset == "") {
        ipa.onset = "ʔ";
    }

    ipaSQL = ipadb.exec("SELECT phone FROM TaiLue where roman='" + ipa.tone + "' ");
    if (ipaSQL.length > 0) {
        ipa.tone = ipaSQL[0].values[0] + "";
        if (ipa.tone == "51") {
            ipa.rime = ipa.rime.replace('e', 'é').replace('ê', 'ế').replace('i', 'í').replace('o', 'ó').replace('ô', 'ố').replace('ơ', 'ớ').replace('u', 'ú').replace('ư', 'ứ');
        }
        else if (ipa.tone == "52") {
            ipa.rime = ipa.rime.replace('u', 'ù');
        }
        ipa.tone = ipa.tone.replace('0', '').replace('1', '').replace('2', '').replace('4', '').replace('5', '').replace('ˀ', '');
    }
    else
        return w;
    ipaSQL = ipadb.exec("SELECT phone FROM TaiLue where roman='" + ipa.rime + "' ");
    if (ipaSQL.length > 0)
        ipa.rime = ipaSQL[0].values[0] + "";
    else
        return w;

    ipaSQL = ipadb.exec("SELECT phone FROM TaiLue where roman='" + ipa.onset + "' ");
    if (ipaSQL.length > 0)
        ipa.onset = ipaSQL[0].values[0] + ipa.glide;
    else
        return w;
    var res = "" + ipa.onset + ipa.tone + ipa.rime.replace("◌", "");
    return res.replace("𕈟𕈻𕈇", "𕉉");
}

function TaiYorimetone(rime, tone) {
    var rimetone = rime;
    switch (tone) {
        case "̃":
            rimetone = rime.replace("iê", "iễ").replace("uô", "uỗ").replace("ươ", "ưỡ").replace("ơơ", "ơỡ").replace("ôô", "ôỗ").replace("êê", "êễ").replace("uu", "uũ").replace("yi", "yĩ").replace("ii", "iĩ").replace("ưư", "ưữ").replace("iu", "ĩu").replace("ia", "ĩa").replace("ya", "ỹa").replace("ua", "ũa").replace("ưa", "ữa");
            if (rimetone == rime) {
                rimetone = rime.replace("a", "ã").replace("ă", "ẵ").replace("â", "ẫ").replace("ơ", "ỡ").replace("ô", "ỗ").replace("e", "ẽ").replace("ê", "ễ");
                if (rimetone == rime) {
                    rimetone = rime.replace("o", "õ").replace("u", "ũ").replace("ư", "ữ");
                    if (rimetone == rime) {
                        rimetone = rime.replace("i", "ĩ").replace("y", "ỹ");
                    }
                }
            }
            break;
        case "̉":
            rimetone = rime.replace("iê", "iể").replace("uô", "uổ").replace("ươ", "ưở").replace("ơơ", "ơở").replace("ôô", "ôổ").replace("êê", "êể").replace("uu", "uủ").replace("yi", "yỉ").replace("ii", "iỉ").replace("ưư", "ưử").replace("iu", "ỉu").replace("ia", "ỉa").replace("ya", "ỷa").replace("ua", "ủa").replace("ưa", "ửa");
            if (rimetone == rime) {
                rimetone = rime.replace("a", "ả").replace("ă", "ẳ").replace("â", "ẩ").replace("ơ", "ở").replace("ô", "ổ").replace("e", "ẻ").replace("ê", "ể");
                if (rimetone == rime) {
                    rimetone = rime.replace("o", "ỏ").replace("u", "ủ").replace("ư", "ử");
                    if (rimetone == rime) {
                        rimetone = rime.replace("i", "ỉ").replace("y", "ỷ");
                    }
                }
            }
            break;
        case "́":
            rimetone = rime.replace("iê", "iế").replace("uô", "uố").replace("ươ", "ướ").replace("ơơ", "ơớ").replace("ôô", "ôố").replace("êê", "êế").replace("uu", "uú").replace("yi", "yí").replace("ii", "ií").replace("ưư", "ưứ").replace("iu", "íu").replace("ia", "ía").replace("ya", "ýa").replace("ua", "úa").replace("ưa", "ứa");
            if (rimetone == rime) {
                rimetone = rime.replace("a", "á").replace("ă", "ắ").replace("â", "ấ").replace("ơ", "ớ").replace("ô", "ố").replace("e", "é").replace("ê", "ế");
                if (rimetone == rime) {
                    rimetone = rime.replace("o", "ó").replace("u", "ú").replace("ư", "ứ");
                    if (rimetone == rime) {
                        rimetone = rime.replace("i", "í").replace("y", "ý");
                    }
                }
            }
            break;
        case "̀":
            rimetone = rime.replace("iê", "iề").replace("uô", "uồ").replace("ươ", "ườ").replace("ơơ", "ơờ").replace("ôô", "ôồ").replace("êê", "êề").replace("uu", "uù").replace("yi", "yì").replace("ii", "iì").replace("ưư", "ưừ").replace("iu", "ìu").replace("ia", "ìa").replace("ya", "ỳa").replace("ua", "ùa").replace("ưa", "ừa");
            if (rimetone == rime) {
                rimetone = rime.replace("a", "à").replace("ă", "ằ").replace("â", "ầ").replace("ơ", "ờ").replace("ô", "ồ").replace("e", "è").replace("ê", "ề");
                if (rimetone == rime) {
                    rimetone = rime.replace("o", "ò").replace("u", "ù").replace("ư", "ừ");
                    if (rimetone == rime) {
                        rimetone = rime.replace("i", "ì").replace("y", "ỳ");
                    }
                }
            }
            break;
        case "̣":
            rimetone = rime.replace("iê", "iệ").replace("uô", "uộ").replace("ươ", "ượ").replace("ơơ", "ơợ").replace("ôô", "ôộ").replace("êê", "êệ").replace("uu", "uụ").replace("yi", "yị").replace("ii", "iị").replace("ưư", "ưự").replace("iu", "ịu").replace("ia", "ịa").replace("ya", "ỵa").replace("ua", "ụa").replace("ưa", "ựa");
            if (rimetone == rime) {
                rimetone = rime.replace("a", "ạ").replace("ă", "ặ").replace("â", "ậ").replace("ơ", "ợ").replace("ô", "ộ").replace("e", "ẹ").replace("ê", "ệ");
                if (rimetone == rime) {
                    rimetone = rime.replace("o", "ọ").replace("u", "ụ").replace("ư", "ự");
                    if (rimetone == rime) {
                        rimetone = rime.replace("i", "ị").replace("y", "ỵ");
                    }
                }
            }
            break;
        case "̄":
            rimetone = rime.replace("iê", "iê̄").replace("uô", "uô̄").replace("ươ", "ươ̄").replace("ơơ", "ơơ̄").replace("ôô", "ôô̄").replace("êê", "êê̄").replace("uu", "uū").replace("yi", "yī").replace("ii", "iī").replace("ưư", "ưư̄").replace("iu", "īu").replace("ia", "īa").replace("ya", "ȳa").replace("ua", "ūa").replace("ưa", "ư̄a");
            if (rimetone == rime) {
                rimetone = rime.replace("a", "ā").replace("ă", "ă̄").replace("â", "â̄").replace("ơ", "ơ̄").replace("ô", "ô̄").replace("e", "ē").replace("ê", "ê̄");
                if (rimetone == rime) {
                    rimetone = rime.replace("o", "ō").replace("u", "ū").replace("ư", "ư̄");
                    if (rimetone == rime) {
                        rimetone = rime.replace("i", "ī").replace("y", "ȳ");
                    }
                }
            }
            break;
        case "̱":
            rimetone = rime.replace("iê", "iê̱").replace("uô", "uô̱").replace("ươ", "ươ̱").replace("ơơ", "ơơ̱").replace("ôô", "ôô̱").replace("êê", "êê̱").replace("uu", "uu̱").replace("yi", "yi̱").replace("ii", "ii̱").replace("ưư", "ưư̱").replace("iu", "i̱u").replace("ia", "i̱a").replace("ya", "y̱a").replace("ua", "u̱a").replace("ưa", "ư̱a");
            if (rimetone == rime) {
                rimetone = rime.replace("a", "a̱").replace("ă", "ă̱").replace("â", "â̱").replace("ơ", "ơ̱").replace("ô", "ô̱").replace("e", "e̱").replace("ê", "ê̱");
                if (rimetone == rime) {
                    rimetone = rime.replace("o", "o̱").replace("u", "u̱").replace("ư", "ư̱");
                    if (rimetone == rime) {
                        rimetone = rime.replace("i", "i̱").replace("y", "y̱");
                    }
                }
            }
            break;
        case "̌":
            rimetone = rime.replace("iê", "iê̌").replace("uô", "uô̌").replace("ươ", "ươ̌").replace("ơơ", "ơơ̌").replace("ôô", "ôô̌").replace("êê", "êê̌").replace("uu", "uǔ").replace("yi", "yǐ").replace("ii", "iǐ").replace("ưư", "ưư̌").replace("iu", "ǐu").replace("ia", "ǐa").replace("ya", "y̌a").replace("ua", "ǔa").replace("ưa", "ư̌a");
            if (rimetone == rime) {
                rimetone = rime.replace("a", "ǎ").replace("ă", "ă̌").replace("â", "â̌").replace("ơ", "ơ̌").replace("ô", "ô̌").replace("e", "ě").replace("ê", "ê̌");
                if (rimetone == rime) {
                    rimetone = rime.replace("o", "ǒ").replace("u", "ǔ").replace("ư", "ư̌");
                    if (rimetone == rime) {
                        rimetone = rime.replace("i", "ǐ").replace("y", "y̌");
                    }
                }
            }
            break;
        default:
            break;
    }
    return rimetone;
}

function Nungrimetone(rime, tone) {
    var rimetone = rime;
    switch (tone) {
        case "̈":
            rimetone = rime.replace("ie", "ië").replace("uo", "uö").replace("ưa", "ưä").replace("aa", "aä").replace("ee", "eë").replace("oo", "oö").replace("uu", "uü").replace("ii", "iï").replace("ưư", "ưư̈");
            if (rimetone == rime) {
                rimetone = rime.replace("a", "ä").replace("â", "â̈").replace("ơ", "ơ̈").replace("ô", "ô̈").replace("e", "ë").replace("ê", "ê̈");
                if (rimetone == rime) {
                    rimetone = rime.replace("o", "ö");
					if (rimetone == rime) {
						rimetone = rime.replace("u", "ü").replace("ư", "ư̈").replace("i", "ï");
					}
                }
            }
            break;
        case "̄":
            rimetone = rime.replace("ie", "iē").replace("uo", "uō").replace("ưa", "ưā").replace("aa", "aā").replace("ee", "eē").replace("oo", "oō").replace("uu", "uū").replace("ii", "iī").replace("ưư", "ưư̄");
            if (rimetone == rime) {
                rimetone = rime.replace("a", "ā").replace("â", "â̄").replace("ơ", "ơ̄").replace("ô", "ô̄").replace("e", "ē").replace("ê", "ê̄");
                if (rimetone == rime) {
                    rimetone = rime.replace("o", "ō");
					if (rimetone == rime) {
						rimetone = rime.replace("u", "ū").replace("ư", "ư̄").replace("i", "ī");
					}
                }
            }
            break;
        case "̌":
            rimetone = rime.replace("ie", "iě").replace("uo", "uǒ").replace("ưa", "ưǎ").replace("aa", "aǎ").replace("ee", "eě").replace("oo", "oǒ").replace("uu", "uǔ").replace("ii", "iǐ").replace("ưư", "ưư̌");
            if (rimetone == rime) {
                rimetone = rime.replace("a", "ǎ").replace("â", "â̌").replace("ơ", "ơ̌").replace("ô", "ô̌").replace("e", "ě").replace("ê", "ê̌");
                if (rimetone == rime) {
                    rimetone = rime.replace("o", "ǒ");
					if (rimetone == rime) {
						rimetone = rime.replace("u", "ǔ").replace("ư", "ư̌").replace("i", "ǐ");
					}
                }
            }
            break;
        case "̤":
            rimetone = rime.replace("ie", "ie̤").replace("uo", "uo̤").replace("ưa", "ưa̤").replace("aa", "aa̤").replace("ee", "ee̤").replace("oo", "oo̤").replace("uu", "uṳ").replace("ii", "ii̤").replace("ưư", "ưư̤");
            if (rimetone == rime) {
                rimetone = rime.replace("a", "a̤").replace("â", "â̤").replace("ơ", "ơ̤").replace("ô", "ô̤").replace("e", "e̤").replace("ê", "ê̤");
                if (rimetone == rime) {
                    rimetone = rime.replace("o", "o̤");
					if (rimetone == rime) {
						rimetone = rime.replace("u", "ṳ").replace("ư", "ư̤").replace("i", "i̤");
					}
                }
            }
            break;
        case "̱":
            rimetone = rime.replace("ie", "ie̱").replace("uo", "uo̱").replace("ưa", "ưa̱").replace("aa", "aa̱").replace("ee", "ee̱").replace("oo", "oo̱").replace("uu", "uu̱").replace("ii", "ii̱").replace("ưư", "ưư̱");
            if (rimetone == rime) {
                rimetone = rime.replace("a", "a̱").replace("â", "â̱").replace("ơ", "ơ̱").replace("ô", "ô̱").replace("e", "e̱").replace("ê", "ê̱");
                if (rimetone == rime) {
                    rimetone = rime.replace("o", "o̱");
					if (rimetone == rime) {
						rimetone = rime.replace("u", "u̱").replace("ư", "ư̱").replace("i", "i̱");
					}
                }
            }
            break;
        case "̬":
            rimetone = rime.replace("ie", "ie̬").replace("uo", "uo̬").replace("ưa", "ưa̬").replace("aa", "aa̬").replace("ee", "ee̬").replace("oo", "oo̬").replace("uu", "uu̬").replace("ii", "ii̬").replace("ưư", "ưư̬");
            if (rimetone == rime) {
                rimetone = rime.replace("a", "a̬").replace("â", "â̬").replace("ơ", "ơ̬").replace("ô", "ô̬").replace("e", "e̬").replace("ê", "ê̬");
                if (rimetone == rime) {
                    rimetone = rime.replace("o", "o̬");
					if (rimetone == rime) {
						rimetone = rime.replace("u", "u̬").replace("ư", "ư̬").replace("i", "i̬");
					}
                }
            }
            break;
        default:
            break;
    }
    return rimetone;
}

function TayIPA(w, accent) {
    var ipa = {};
    ipa.onset = "", ipa.rime = "", ipa.tone = "";
    var toneclass = 1;
    for (var i = 0; i < w.length; i++) {
        var c = w.charAt(i);
        if ("qrtpsdđfghjklzxcvbnm".includes(c)) {
            ipa.onset += c;
        }
        else {
            if (ipa.onset == "q") {
                ipa.onset = "qu";
                ipa.rime = w.substring(i + 1);
            } else {
                ipa.rime = w.substring(i);
            }
            break;
        }
    }

    for (var i = 0; i < ipa.rime.length; i++) {
        var c = ipa.rime.charAt(i);
        var c_plain = "";
        switch (c) {
            case 'á': ipa.tone = "́"; c_plain = 'a'; break; case 'à': ipa.tone = "̀"; c_plain = 'a'; toneclass = 2; break; case 'ả': ipa.tone = "̉"; c_plain = 'a'; break; case 'ã': ipa.tone = "̣"; c_plain = 'a'; break; case 'ạ': ipa.tone = "̣"; c_plain = 'a'; toneclass = 2; break;
            case 'ấ': ipa.tone = "́"; c_plain = 'â'; break; case 'ầ': ipa.tone = "̀"; c_plain = 'â'; toneclass = 2; break; case 'ẩ': ipa.tone = "̉"; c_plain = 'â'; break; case 'ẫ': ipa.tone = "̣"; c_plain = 'â'; break; case 'ậ': ipa.tone = "̣"; c_plain = 'â'; toneclass = 2; break;
            case 'ắ': ipa.tone = "́"; c_plain = 'ă'; break; case 'ằ': ipa.tone = "̀"; c_plain = 'ă'; toneclass = 2; break; case 'ẳ': ipa.tone = "̉"; c_plain = 'ă'; break; case 'ẵ': ipa.tone = "̣"; c_plain = 'ă'; break; case 'ặ': ipa.tone = "̣"; c_plain = 'ă'; toneclass = 2; break;
            case 'é': ipa.tone = "́"; c_plain = 'e'; break; case 'è': ipa.tone = "̀"; c_plain = 'e'; toneclass = 2; break; case 'ẻ': ipa.tone = "̉"; c_plain = 'e'; break; case 'ẽ': ipa.tone = "̣"; c_plain = 'e'; break; case 'ẹ': ipa.tone = "̣"; c_plain = 'e'; toneclass = 2; break;
            case 'ế': ipa.tone = "́"; c_plain = 'ê'; break; case 'ề': ipa.tone = "̀"; c_plain = 'ê'; toneclass = 2; break; case 'ể': ipa.tone = "̉"; c_plain = 'ê'; break; case 'ễ': ipa.tone = "̣"; c_plain = 'ê'; break; case 'ệ': ipa.tone = "̣"; c_plain = 'ê'; toneclass = 2; break;
            case 'í': ipa.tone = "́"; c_plain = 'i'; break; case 'ì': ipa.tone = "̀"; c_plain = 'i'; toneclass = 2; break; case 'ỉ': ipa.tone = "̉"; c_plain = 'i'; break; case 'ĩ': ipa.tone = "̣"; c_plain = 'i'; break; case 'ị': ipa.tone = "̣"; c_plain = 'i'; toneclass = 2; break;
            case 'ó': ipa.tone = "́"; c_plain = 'o'; break; case 'ò': ipa.tone = "̀"; c_plain = 'o'; toneclass = 2; break; case 'ỏ': ipa.tone = "̉"; c_plain = 'o'; break; case 'õ': ipa.tone = "̣"; c_plain = 'o'; break; case 'ọ': ipa.tone = "̣"; c_plain = 'o'; toneclass = 2; break;
            case 'ố': ipa.tone = "́"; c_plain = 'ô'; break; case 'ồ': ipa.tone = "̀"; c_plain = 'ô'; toneclass = 2; break; case 'ổ': ipa.tone = "̉"; c_plain = 'ô'; break; case 'ỗ': ipa.tone = "̣"; c_plain = 'ô'; break; case 'ộ': ipa.tone = "̣"; c_plain = 'ô'; toneclass = 2; break;
            case 'ớ': ipa.tone = "́"; c_plain = 'ơ'; break; case 'ờ': ipa.tone = "̀"; c_plain = 'ơ'; toneclass = 2; break; case 'ở': ipa.tone = "̉"; c_plain = 'ơ'; break; case 'ỡ': ipa.tone = "̣"; c_plain = 'ơ'; break; case 'ợ': ipa.tone = "̣"; c_plain = 'ơ'; toneclass = 2; break;
            case 'ú': ipa.tone = "́"; c_plain = 'u'; break; case 'ù': ipa.tone = "̀"; c_plain = 'u'; toneclass = 2; break; case 'ủ': ipa.tone = "̉"; c_plain = 'u'; break; case 'ũ': ipa.tone = "̣"; c_plain = 'u'; break; case 'ụ': ipa.tone = "̣"; c_plain = 'u'; toneclass = 2; break;
            case 'ứ': ipa.tone = "́"; c_plain = 'ư'; break; case 'ừ': ipa.tone = "̀"; c_plain = 'ư'; toneclass = 2; break; case 'ử': ipa.tone = "̉"; c_plain = 'ư'; break; case 'ữ': ipa.tone = "̣"; c_plain = 'ư'; break; case 'ự': ipa.tone = "̣"; c_plain = 'ư'; toneclass = 2; break;
            case 'ý': ipa.tone = "́"; c_plain = 'y'; break; case 'ỳ': ipa.tone = "̀"; c_plain = 'y'; toneclass = 2; break; case 'ỷ': ipa.tone = "̉"; c_plain = 'y'; break; case 'ỹ': ipa.tone = "̣"; c_plain = 'y'; break; case 'ỵ': ipa.tone = "̣"; c_plain = 'y'; toneclass = 2; break;
            case '̱': c_plain = ""; ipa.tone = "̱"; toneclass = 2; break;
            default: c_plain = c; break;
        }
        if (c_plain != c) {
            ipa.rime = ipa.rime.substr(0, i) + c_plain + ipa.rime.substr(i + 1);
            break;
        }
    }
    var deadcons = ipa.rime.slice(ipa.rime.length - 1)
    if ("pct".includes(deadcons) || (ipa.rime.slice(ipa.rime.length - 3) == "ch")) {
		if ((ipa.rime.includes("ă") || ipa.rime.includes("â") || ipa.rime.includes("ô") || ipa.rime.includes("i") || ipa.rime.includes("y") || ipa.rime.includes("u") || ipa.rime.includes("ư")) && !(ipa.rime.includes("uô") || ipa.rime.includes("iê") || ipa.rime.includes("ươ") || ipa.rime.includes("ii") || ipa.rime.includes("ưư") || ipa.rime.includes("uu")))
			ipa.tone += "ˀ";
		else
			ipa.tone += "ˀ0";
	}

    if (ipa.tone == "") {
        ipa.tone = "ʔ";
    }
    if (ipa.onset == "") {
        ipa.onset = "∅";
    }
    if (['c', 'k', 'qu', 'kr', 'ch', 'x', 't', 'p', 'pj', 'pr', 'f', 'd', 'kj'].includes(ipa.onset) && (toneclass == 2)) {
        ipa.onset += "̤";
    }

    ipaSQL = ipadb.exec("SELECT " + accent + " FROM Tay where phone='" + ipa.onset + "' ");
    if (ipaSQL.length > 0)
        ipa.onset = ipaSQL[0].values[0][0];
    else
        return { onset: "", rime: "∅", tone: "" };
    ipaSQL = ipadb.exec("SELECT " + accent + " FROM Tay where phone='" + ipa.rime + "' ");
    if (ipaSQL.length > 0)
        ipa.rime = ipaSQL[0].values[0][0];
    else
        return { onset: "", rime: "∅", tone: "" };
    ipaSQL = ipadb.exec("SELECT " + accent + " FROM Tay where phone='" + ipa.tone + "' ");
    if (ipaSQL.length > 0)
        ipa.tone = ipaSQL[0].values[0][0];
    else
        return { onset: "", rime: "∅", tone: "" };

        if (accent == "roman") {
            /*
			-ipa.onset = ipa.onset.replace("̤", "");
            if ((ipa.onset == "k") && !ipa.rime.startsWith("i") && !ipa.rime.startsWith("e") && !ipa.rime.startsWith("ê")) {
                ipa.onset = ipa.onset.replace("k", "c").replace("g", "gh").replace("ng", "ngh");
            }
            if (ipa.rime.startsWith("i") || ipa.rime.startsWith("ơ") || ipa.rime.startsWith("ê") || ipa.rime.startsWith("â")) {
                ipa.onset = ipa.onset.replace("w", "u");
            } else {
                ipa.onset = ipa.onset.replace("w", "o");
            }
			*/
            return "" + ((ipa.onset == '∅') ? '' : ipa.onset) + Nungrimetone(ipa.rime, ipa.tone.replace('ˀ', ''));
        }
		
    return (ipa);
}

function VietIPA(w, accent) {
    var ipa = {};
    ipa.onset = "", ipa.rime = "", ipa.tone = "";
    for (var i = 0; i < w.length; i++) {
        var c = w.charAt(i);
        if ("qrtpsdđfghjklzxcvbnm".includes(c)) {
            ipa.onset += c;
        }
        else {
            if (ipa.onset == "q") {
                ipa.onset = "qu";
                ipa.rime = w.substring(i + 1);
            } else if ((ipa.onset == "g") && (i == 1) && "iìíỉĩịyỳýỷỹỵ".includes(c)) {
                ipa.onset = "gi";
                ipa.rime = w.substring(i);
            } else {
                ipa.rime = w.substring(i);
            }
            break;
        }
    }

    for (var i = 0; i < ipa.rime.length; i++) {
        var c = ipa.rime.charAt(i);
        var c_plain = "";
        switch (c) {
            case 'á': ipa.tone = "́"; c_plain = 'a'; break; case 'à': ipa.tone = "̀"; c_plain = 'a'; break; case 'ả': ipa.tone = "̉"; c_plain = 'a'; break; case 'ã': ipa.tone = "̃"; c_plain = 'a'; break; case 'ạ': ipa.tone = "̣"; c_plain = 'a'; break;
            case 'ấ': ipa.tone = "́"; c_plain = 'â'; break; case 'ầ': ipa.tone = "̀"; c_plain = 'â'; break; case 'ẩ': ipa.tone = "̉"; c_plain = 'â'; break; case 'ẫ': ipa.tone = "̃"; c_plain = 'â'; break; case 'ậ': ipa.tone = "̣"; c_plain = 'â'; break;
            case 'ắ': ipa.tone = "́"; c_plain = 'ă'; break; case 'ằ': ipa.tone = "̀"; c_plain = 'ă'; break; case 'ẳ': ipa.tone = "̉"; c_plain = 'ă'; break; case 'ẵ': ipa.tone = "̃"; c_plain = 'ă'; break; case 'ặ': ipa.tone = "̣"; c_plain = 'ă'; break;
            case 'é': ipa.tone = "́"; c_plain = 'e'; break; case 'è': ipa.tone = "̀"; c_plain = 'e'; break; case 'ẻ': ipa.tone = "̉"; c_plain = 'e'; break; case 'ẽ': ipa.tone = "̃"; c_plain = 'e'; break; case 'ẹ': ipa.tone = "̣"; c_plain = 'e'; break;
            case 'ế': ipa.tone = "́"; c_plain = 'ê'; break; case 'ề': ipa.tone = "̀"; c_plain = 'ê'; break; case 'ể': ipa.tone = "̉"; c_plain = 'ê'; break; case 'ễ': ipa.tone = "̃"; c_plain = 'ê'; break; case 'ệ': ipa.tone = "̣"; c_plain = 'ê'; break;
            case 'í': ipa.tone = "́"; c_plain = 'i'; break; case 'ì': ipa.tone = "̀"; c_plain = 'i'; break; case 'ỉ': ipa.tone = "̉"; c_plain = 'i'; break; case 'ĩ': ipa.tone = "̃"; c_plain = 'i'; break; case 'ị': ipa.tone = "̣"; c_plain = 'i'; break;
            case 'ó': ipa.tone = "́"; c_plain = 'o'; break; case 'ò': ipa.tone = "̀"; c_plain = 'o'; break; case 'ỏ': ipa.tone = "̉"; c_plain = 'o'; break; case 'õ': ipa.tone = "̃"; c_plain = 'o'; break; case 'ọ': ipa.tone = "̣"; c_plain = 'o'; break;
            case 'ố': ipa.tone = "́"; c_plain = 'ô'; break; case 'ồ': ipa.tone = "̀"; c_plain = 'ô'; break; case 'ổ': ipa.tone = "̉"; c_plain = 'ô'; break; case 'ỗ': ipa.tone = "̃"; c_plain = 'ô'; break; case 'ộ': ipa.tone = "̣"; c_plain = 'ô'; break;
            case 'ớ': ipa.tone = "́"; c_plain = 'ơ'; break; case 'ờ': ipa.tone = "̀"; c_plain = 'ơ'; break; case 'ở': ipa.tone = "̉"; c_plain = 'ơ'; break; case 'ỡ': ipa.tone = "̃"; c_plain = 'ơ'; break; case 'ợ': ipa.tone = "̣"; c_plain = 'ơ'; break;
            case 'ú': ipa.tone = "́"; c_plain = 'u'; break; case 'ù': ipa.tone = "̀"; c_plain = 'u'; break; case 'ủ': ipa.tone = "̉"; c_plain = 'u'; break; case 'ũ': ipa.tone = "̃"; c_plain = 'u'; break; case 'ụ': ipa.tone = "̣"; c_plain = 'u'; break;
            case 'ứ': ipa.tone = "́"; c_plain = 'ư'; break; case 'ừ': ipa.tone = "̀"; c_plain = 'ư'; break; case 'ử': ipa.tone = "̉"; c_plain = 'ư'; break; case 'ữ': ipa.tone = "̃"; c_plain = 'ư'; break; case 'ự': ipa.tone = "̣"; c_plain = 'ư'; break;
            case 'ý': ipa.tone = "́"; c_plain = 'y'; break; case 'ỳ': ipa.tone = "̀"; c_plain = 'y'; break; case 'ỷ': ipa.tone = "̉"; c_plain = 'y'; break; case 'ỹ': ipa.tone = "̃"; c_plain = 'y'; break; case 'ỵ': ipa.tone = "̣"; c_plain = 'y'; break;
            default: c_plain = c; break;
        }
        if (c_plain != c) {
            ipa.rime = ipa.rime.substr(0, i) + c_plain + ipa.rime.substr(i + 1);
            break;
        }
    }
    var deadcons = ipa.rime.slice(ipa.rime.length - 1)
    if ("pct".includes(deadcons) || (ipa.rime.slice(ipa.rime.length - 2) == "ch"))
        ipa.tone += "ˀ";

    if (ipa.tone == "") {
        ipa.tone = "ʔ";
    }
    if (ipa.onset == "") {
        ipa.onset = "∅";
    }
    if ((ipa.onset == "qu") && (ipa.rime == "ôc")) {
        ipa.onset = "q";
        ipa.rime = "uâc";
    }
    if (((ipa.onset == "kh") || (ipa.onset == "g") || (ipa.onset == "ng") || (ipa.onset == "h")) && (ipa.rime.startsWith("oa") || ipa.rime.startsWith("oă") || ipa.rime.startsWith("oe") || ipa.rime.startsWith("uâ") || ipa.rime.startsWith("uê") || ipa.rime.startsWith("uy") || ipa.rime.startsWith("uơ"))) {
        ipa.onset += "w";
    }
    if ((ipa.onset == "gi") && !['i', 'in', 'it', 'inh', 'ich', 'im', 'ip', 'iên', 'iêt', 'iêng', 'iêc', 'iêm', 'iêp', 'ya'].includes(ipa.rime)) {
        ipa.rime = ipa.rime.substring(1);
    }

    ipaSQL = ipadb.exec("SELECT " + accent + " FROM Viet where phone='" + ipa.onset + "' ");
    if (ipaSQL.length > 0)
        ipa.onset = ipaSQL[0].values[0];
    else
        return { onset: "", rime: "∅", tone: "" };
    ipaSQL = ipadb.exec("SELECT " + accent + " FROM Viet where phone='" + ipa.rime + "' ");
    if (ipaSQL.length > 0)
        ipa.rime = ipaSQL[0].values[0];
    else
        return { onset: "", rime: "∅", tone: "" };
    ipaSQL = ipadb.exec("SELECT " + accent + " FROM Viet where phone='" + ipa.tone + "' ");
    if (ipaSQL.length > 0)
        ipa.tone = ipaSQL[0].values[0];
    else
        return {onset: "", rime: "∅", tone: ""};

    return (ipa);
}