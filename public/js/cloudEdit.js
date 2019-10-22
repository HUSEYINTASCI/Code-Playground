
(function cloudEdit() {
  "use strict";

  var use = {
    Autoprefixer: false,
    Less: false,
    Sass: false,
    Modernizr: false,
    Normalize: false,
    Bootstrap: false,
    Foundation: false,
    liveEdit: true
  };


  // Check if a new appcache is available on page load. If so, ask to load it.
  window.addEventListener("load", function (e) {
    window.applicationCache.addEventListener("updateready", function (e) {
      if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
        // Browser downloaded a new app cache.
        if (confirm("A new version of this site is available. Load it?")) {
          window.location.reload();
        }
      } else {

      }
    }, false);
  }, false);

  // Create Text Area panes
  (function initAce() {
    var aceTheme;
    aceTheme = "ace/theme/merbivore";

    // HTML Editor
    window.htmlField = ace.edit("html");
    htmlField.setOptions({
      useWorker: false,
      theme: aceTheme,
      displayIndentGuides: true,
      mode: "ace/mode/html",
      tabSize: 2,
      useSoftTabs: true,
      showPrintMargin: false,
      enableEmmet: true
    });
    // User Login
    var uname = $("#usrr");
    var b = localStorage.getItem("user");
    if (b == null) {
      uname.text("Hello Guest user you must have an account to Download , Save Local St. and Load Local St. code. ");
    } else {
      uname.text("Hello " + b);
      $("#log").text("Log Out");
    }

    if (b == null) {
      $("#download").css("display", "none");
      $("#save").css("display", "none");
      $("#load").css("display", "none");

    }

    // CSS Editor
    window.cssField = ace.edit("css");
    cssField.setOptions({
      theme: aceTheme,
      displayIndentGuides: true,
      mode: "ace/mode/css",
      tabSize: 2,
      useSoftTabs: true,
      showPrintMargin: false,
      enableEmmet: true
    });

    // JS Editor
    window.jsField = ace.edit("js");
    jsField.setOptions({
      theme: aceTheme,
      displayIndentGuides: true,
      mode: "ace/mode/javascript",
      tabSize: 2,
      useSoftTabs: true,
      showPrintMargin: false
    });

    // Retrieve values from sessionStorage if set
    (function sessionStorageGet() {
      if (sessionStorage.getItem("html")) {
        htmlField.setValue(sessionStorage.getItem("html"));
        // htmlField.clearSelection();
      } else {

      }
      if (sessionStorage.getItem("css")) {
        cssField.setValue(sessionStorage.getItem("css"));
        cssField.clearSelection();
      }
      if (sessionStorage.getItem("js")) {
        jsField.setValue(sessionStorage.getItem("js"));
        jsField.clearSelection();
      }
      if (sessionStorage.getItem("use")) {
        use = JSON.parse(sessionStorage.getItem("use"));
      }
      if (sessionStorage.getItem("cssMode")) {
        cssField.getSession().setMode(sessionStorage.getItem("cssMode"));
      }
    })();

  })();

  // Toggle Text Areas from Displaying
  $(".togglePane").on("click", function () {
    panes.close(this);
  });
  $("#consoleToggle").on("click", function () {
    $(this).toggleClass("btn-active");
    $(".console").toggle();
  });
  $("#previewToggle, #iframeClose").on("click", function () {
    $("#previewToggle").toggleClass("btn-active");
    $("html").toggleClass("modal-open");
  });

  var panes = {
    // Return the number of editor panes displayed
    count: function () {
      var count = 3;
      var items = $(".windowGroup .column-33");
      items.each(function (el) {
        if ($(items[el]).css("display") === "none") count -= 1;
      });
      return count;
    },
    // Resize panes based upon number currently toggled ON
    resize: function () {
      var count = this.count();
      var win = $(".windowGroup .column-33");
      if (count === 3 || count === 0) {
        win.css("width", "33%");
      } else if (count === 2) {
        win.css("width", "49.5%");
      } else if (count === 1) {
        win.css("width", "99%");
      }
    },
    // On toggling an editor pane resize remaining and toggle button class
    close: function (el) {
      var name = el.dataset.editor;
      var count = this.count();
      if (count > 1 || $(el).hasClass("btn-active")) {
        $(el).toggleClass("btn-active");
        $(".window." + name).parent().toggle();
        this.resize();
      } else {
        alert("You Must Have at least one Editor open");
      }
    }
  };
  // Used by preview and download to compile editor panes and "Imports" into valid html
  function buildOutput(consoleJS) {

    var content = {
      html: htmlField.getValue(),
      style: cssField.getValue(),
      js: jsField.getValue()
    };

    // If using Autoprefixer, load it first via XMLHTTPRequest but do so only once.
    if (use.Autoprefixer && typeof autoprefixer === "undefined") {
      (function loadAutoprefixer() {
        var xmlHttp = null;
        xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", "http://rawgit.com/ai/autoprefixer-rails/master/vendor/autoprefixer.js", false);
        xmlHttp.send(null);
        var ap = document.createElement("script");
        ap.type = "text/javascript";
        ap.text = xmlHttp.responseText;
        document.getElementsByTagName("head")[0].appendChild(ap);
      })();
    }

    // If using Sass, load it first via XMLHTTPRequest but do so only once.
    // We don't want to include it from the get-go as it's 2 Megabytes!!
    if (use.Sass && typeof Sass === "undefined") {
      (function loadSass() {
        var xmlHttp = null;
        xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", "https://cdnjs.cloudflare.com/ajax/libs/sass.js/0.11.0/sass.min.js", false);
        xmlHttp.send(null);
        var sass = document.createElement("script");
        sass.id = "sass";
        sass.type = "text/sass";
        sass.text = xmlHttp.responseText;
        document.getElementsByTagName("head")[0].appendChild(sass);
      })();
    }

    // String to hold elements to build HTML output
    var html = '';
    html += '<!DOCTYPE html>\n';
    html += '<html lang="en">\n';
    html += '<head>\n';
    html += '<meta charset="UTF-8">\n';
    if (use.Normalize) {
      html += '<link href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css" rel="stylesheet">\n';
    }
    if (use.Bootstrap) {
      html += '<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">\n';
    }
    if (use.Foundation) {
      html += '<link href="https://cdnjs.cloudflare.com/ajax/libs/foundation/6.5.3/js/foundation.min.js" rel="stylesheet">\n';
    }
    if (use.Less) {
      html += '<style type="text/less">\n';
    } else {
      html += '<style type="text/css">\n';
    }
    if (use.Autoprefixer) {
      html += autoprefixer({ cascade: true }).process(content.style).css;
    } else if (use.Sass) {
      html += Sass.compile(content.style);
    } else {
      html += content.style;
    }
    html += '\n</style>\n';
    html += '<script src="https://code.jquery.com/jquery-3.4.1.js" integrity="sha256-WpOohJOqMqqyKL9FccASB9O0KwACQJpFTUBLTYOVvVU="crossorigin="anonymous"></script>\n';
    if (use.Bootstrap) {
      html += '<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>\n';
    }
    if (use.Foundation) {
      html += '<script src="https://cdnjs.cloudflare.com/ajax/libs/foundation/6.5.3/js/foundation.min.js"></script>\n';
    }
    if (use.Modernizr) {
      html += '<script src="https://cdnjs.cloudflare.com/ajax/libs/modernizr/2.8.3/modernizr.min.js"></script>\n';
    }
    if (use.Less) {
      // Set LESS global variable to turn errorReporting off and mode to production
      html += '<script>\nless={env: "production", errorReporting: null}\n</script>\n';
      html += '<script src="https://cdnjs.cloudflare.com/ajax/libs/less.js/3.10.3/less.min.js"></script>\n';
    }
    html += '</head>\n';
    html += '<body>\n';
    html += content.html;
    // true if previewing in the preview pane; false if called by download function.
    if (consoleJS) {
      html += '\n<script src="js/console.min.js"></script>\n';
    }
    html += '\n<script>\n';
    html += content.js;
    html += '\n</script>\n';
    html += '</body>\n';
    html += '</html>';

    return html;
  }


  // Toggle live edit/preview mode. It's sometimes slow or doesn't react well.
  $("#liveEdit").on("click", function () {
    use.liveEdit ? use.liveEdit = false : use.liveEdit = true;
    $(this).toggleClass("btn-active");
  });

  // Publish output from HTML, CSS, and JS textareas in the iframe below
  htmlField.getSession().on("change", function (e) {
    $('.html-container').remove();
    if (use.liveEdit) preview(1000);
  });
  cssField.getSession().on("change", function (e) {
    $('.html-container').remove();
    if (use.liveEdit) preview(2000);
  });
  jsField.getSession().on("change", function (e) {
    $('.html-container').remove();
    if (use.liveEdit) preview(2000);
  });

  // Update preview window AND js console on click of "Run" button
  $("#run").on("click", function () {
    preview();
  });

  function preview(delay) {
    delay = delay || 0;
    var timer = null;
    if (timer) {
      window.clearTimeout(timer);
    }
    timer = window.setTimeout(function () {
      timer = null;

      var textToWrite = buildOutput(true);

      (document.getElementById("iframe").contentWindow.document).write(textToWrite);
      (document.getElementById("iframe").contentWindow.document).close();

    }, delay);
  }

  // Download HTML/CSS/JS

  $("#download").on("click", function () {

    function destroyClickedElement(event) {
      document.body.removeChild(event.target);
    }

    var $download = document.createElement("a");

    // pass false as we don't want the pseudo console.js script
    var textToWrite = buildOutput(false);
    var textFileAsBlob = new Blob([textToWrite], { type: "text/plain" });
    var fileNameToSaveAs = "index.html";

    $download.download = fileNameToSaveAs;

    if (typeof window.webkitURL === "function") {
      // Chrome
      $download.href = window.webkitURL.createObjectURL(textFileAsBlob);
    } else {
      // Firefox
      $download.href = window.URL.createObjectURL(textFileAsBlob);
    }
    $download.onclick = destroyClickedElement;
    $download.style.display = "none";
    document.body.appendChild($download);
    $download.click();
  });

  // Clear editors with "Clear" button
  $("#clear").on("click", function () {
    htmlField.setValue("");
    cssField.setValue("");
    jsField.setValue("");
    sessionStorage.clear();
    (document.getElementById("iframe").contentWindow.document).write("");
    (document.getElementById("iframe").contentWindow.document).close();
  });


  //Template

  $("#temp").on("click", function () {

    $(".row [class*=" + "column-" + "] ").css("display", "block");
    $(".windowGroup").css("height", "0");
    $(".preview").css({
      "width": "66%",
       "position": "relative", 
       "-webkit-appearance": "none",
         "border": "1px solid greenyellow",
          "-webkit-box-shadow": "none !important",
           "height": "71.5rem"
    });
    $(".preview").css("margin","0 0 0 505px");
    $("#temp").css("display", "none");

    $("#tempb").css("display", "block");
  });


  $("#tempb").on("click", function () {
    $(".row [class*=" + "column-" + "] ").css("display", "inline-block");
    $(".windowGroup").css("height", "400px");
    $(".preview").css({
      "width": "100%",
      "position": "relative",
      "-webkit-appearance": "none",
      "margin": "0.75em 0 0 0",
      "border": "none !important",
      "border-radius": "3px",
      "-webkit-box-shadow": "none !important",
      "box-shadow": "none !important",
      "height": "37.5rem",
      "top": "100%"
    });

    $("#temp").css("display", "block");

    $("#tempb").css("display", "none");
  });

  //------------------------------------------------------------------------------------------------------------------------------------------
  // Save current editor panes to localStorage
  $("#save").on("click", function () {
    var store = {
      html: htmlField.getValue(),
      css: cssField.getValue(),
      js: jsField.getValue()
    };
    localStorage.setItem("cloudEdit", JSON.stringify(store));
  });

  // Load into editors from localStorage if exists
  $("#load").on("click", function () {
    var store;
    if (localStorage.cloudEdit) {
      store = JSON.parse(localStorage.cloudEdit);
      cssField.setValue(store.css);
      cssField.clearSelection();
      htmlField.setValue(store.html);
      htmlField.clearSelection();
      jsField.setValue(store.js);
      jsField.clearSelection();
    } else {
      alert("No previous session found...");
    }
  });

  // ContextMenu
  // This is going to get VERY unruly BUT.. it minifies well.
  (function contextMenu() {
    $.contextMenu({
      selector: ".windowGroup",
      "items": {
        "css": {
          "name": "CSS Options",
          "items": {
            "plaincss": {
              "name": "Plain CSS [Default]",
              "type": "radio",
              "radio": "css",
              "value": "plaincss",
              "selected": true
            },
            "autoprefixer": {
              "name": "Autoprefixer",
              "type": "radio",
              "radio": "css",
              "value": "autoprefixer",
              "selected": false
            },
            "less": {
              "name": "Less CSS",
              "type": "radio",
              "radio": "css",
              "value": "less",
              "selected": false
            },
            "sass": {
              "name": "Sass CSS [Experimental]",
              "type": "radio",
              "radio": "css",
              "value": "sass",
              "selected": false
            },
            "normalize": {
              "name": "Normalize CSS",
              "radio": "css",
              "value": "normalize",
              "selected": false
            },
            "modernizr": {
              "name": "Modernizr",
              "radio": "css",
              "value": "modernizr",
              "selected": false
            }
          }
        },
        "framework": {
          "name": "Frameworks",
          "items": {
            "none": {
              "name": "None [Default]",
              "type": "radio",
              "radio": "framework",
              "value": "none",
              "selected": true
            },
            "bootstrap": {
              "name": "Bootstrap",
              "type": "radio",
              "radio": "framework",
              "value": "bootstrap",
              "selected": false
            },
            "foundation": {
              "name": "Foundation",
              "type": "radio",
              "radio": "framework",
              "value": "foundation",
              "selected": false
            }
          }
        },
        "themes": {
          "name": "Editor Themes",
          "items": {
            "light": {
              "name": "Light",
              "items": {
                "chrome": {
                  "name": "Chrome [Default]",
                  "callback": function () {
                    updateTheme("chrome");
                  }
                },
              }
            },
            "dark": {
              "name": "Dark",
              "items": {
                "ambiance": {
                  "name": "Ambiance",
                  "callback": function () {
                    updateTheme("ambiance");
                  }
                },
                "merbivore": {
                  "name": "Merbivore",
                  "callback": function () {
                    updateTheme("merbivore");
                  }
                },
              }
            },
            "default": {
              "name": "Default",
              "callback": function () {
                updateTheme("chrome");
              }
            }
          }
        }
      },
      events: {
        show: function (opt) {
          // this is the trigger element
          var $this = this;
          // import states from data store IF set. If we don't check this
          // then default selected items get cleared on initial load
          if ($.contextMenu.getInputValues(opt, $this.data())) {
            $.contextMenu.setInputValues(opt, $this.data());
          }
        },
        hide: function (opt) {
          // this is the trigger element
          var $this = this;
          // export states to data store
          $.contextMenu.getInputValues(opt, $this.data());
        }
      }
    });
  });

  // Get checkbox values from context-menu-input-*
  // and update "global" variable "use" in order to build
  // preview window
  // $("input[name*='context-menu-input']").on("click", function() {
  $(".context-menu-list").on("click", function () {
    var val = $(this).val();
    if (val) {
      switch (val) {
        // CSS Pre-Processor
        case "plaincss":
          $("#cssLabel").text("CSS");
          cssField.getSession().setMode("ace/mode/css");
          use.Autoprefixer = false;
          use.Less = false;
          use.Sass = false;
          break;
        case "autoprefixer":
          $("#cssLabel").text("CSS");
          cssField.getSession().setMode("ace/mode/css");
          use.Autoprefixer = true;
          use.Less = false;
          use.Sass = false;
          break;
        case "less":
          $("#cssLabel").text("LESS");
          cssField.getSession().setMode("ace/mode/less");
          use.Less = true;
          use.Sass = false;
          use.Autoprefixer = false;
          break;
        case "sass":
          $("#cssLabel").text("SASS");
          cssField.getSession().setMode("ace/mode/sass");
          use.Sass = true;
          use.Less = false;
          use.Autoprefixer = false;
          break;
        // CSS Frameworks
        case "none":
          use.Bootstrap = false;
          use.Foundation = false;
          break;
        case "bootstrap":
          use.Bootstrap = true;
          use.Foundation = false;
          break;
        case "foundation":
          use.Foundation = true;
          use.Bootstrap = false;
          break;
        case "normalize":
          use.Bootstrap = false;
          use.Foundation = false;
          break;
        case "modernizr":
          use.Foundation = true;
          use.Bootstrap = true;
          break;
      }
    }
  });



  // Detect a user leaving a page and display a message
  window.onbeforeunload = function (e) {

    // Save current buffers into sessionStorage
    sessionStorage.setItem("html", htmlField.getValue());
    sessionStorage.setItem("css", cssField.getValue());
    sessionStorage.setItem("js", jsField.getValue());

    // save selected imports into sessionStorage
    sessionStorage.setItem("use", JSON.stringify(use));
    // and if using LESS/Sass make sure the editor mode is saved as well
    sessionStorage.setItem("cssMode", cssField.getSession().getMode().$id);

    // If we haven't been passed the event get the window.event
    e = e || window.event;
    var message = "Your current session may be lost..";
    // // For IE6-8 and Firefox prior to version 4
    if (e) e.returnValue = message;
    // // For Chrome, Safari, IE8+ and Opera 12+
    return message;
  };
})();
