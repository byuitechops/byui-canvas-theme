/* IFFY - nothing released into global */
(() => {
  /* ---------- LOADER ---------- */
  const Loader = {
    version: '0.0.1',
    // If mode set to 'development' then verbose will run
    mode: 'development',
    // The resources that have been defined
    resources: {},
    // The actions that have been defined
    actions: {},
    // The defaults used for a resource
    defaultResource: {
      dependencies: [],
      scripts: [],
      styles: [],
      xhr: null,
      hasExistingInstance: () => false,
      findValue: () => null,
      _value: null,
      _error: null,
      _readyState: 'unknown',
      /* Added later
      _tag: tag,
      _callbacks: [],
      */
    },
    // The defaults used for an action
    defaultAction: {
      dependencies: [],
      on: null,
      run() {},
    },
    // Used to define a resource
    defineResource(tag, options) {
      this.resources[tag] = Object.assign({}, this.defaultResource, options);
      this.resources[tag]._callbacks = [];
      this.resources[tag]._tag = tag;
    },
    // Used to define an Action
    defineAction(tag, options) {
      this.actions[tag] = Object.assign({}, this.defaultAction, options);
      this.actions[tag]._tag = tag;
    },
    // Handles the logic of adding listeners if not loaded
    // and running loader if not already run
    getResourceValue(tag, cb) {
      if (this.resources[tag] === undefined) throw new Error(`No resource defined with '${tag}' tag`);
      const resource = this.resources[tag];
      if (resource._readyState === 'unknown') {
        if (resource.hasExistingInstance()) {
          verbose(tag + ' already on the page');
          this.setResourceValue(tag);
        } else {
          resource._readyState = 'loading';
          this.loadResource(tag);
        }
      }
      if (resource._readyState === 'loading') {
        verbose('Waiting for ' + tag);
        resource._callbacks.push(cb);
      } else if (resource._readyState === 'complete') {
        verbose('Already loaded ' + tag);
        cb(resource._error, resource._value);
      } else {
        throw new Error('Unknown Loading State: ' + this._readyState);
      }
    },
    // Handles the logic of calling all of the listeners set
    // and setting all of the data
    setResourceValue(tag, err, data) {
      if (this.resources[tag] === undefined) throw new Error(`No resource defined with '${tag}' tag`);
      const resource = this.resources[tag];
      resource._readyState = 'complete';
      if (err) {
        verbose('Error loading ' + resource._tag);
        resource._error = err;
      } else {
        verbose('Finished loading ' + resource._tag);
        resource._value = data || resource.findValue();
      }
      resource._callbacks.forEach(cb => cb(resource._error, resource._value));
      resource._callbacks = [];
    },
    // Handles loading the resource and it's dependencies
    // Called from getResourceValue, and calls setResourceValue when done
    loadResource(tag) {
      if (this.resources[tag] === undefined) throw new Error(`No resource defined with '${tag}' tag`);
      const resource = this.resources[tag];
      // Wait for dependencies to load
      waitForAll(this, resource.dependencies, this.getResourceValue, function (err) {
        if (err) return this.setResourceValue(tag, err);
        try {
          if (resource.xhr) {
            xhttpRequest(resource.xhr(), (e, data) => this.setResourceValue(tag, e, data));
          } else {
            // Wait for Scripts to load
            waitForAll(this, resource.scripts, loadScript, e => this.setResourceValue(tag, e));
            // Don't wait for style sheets (the onload event for links isn't dependable)
            resource.styles.forEach(href => loadStyle(href));
          }
        } catch (e) {
          return this.setResourceValue(tag, e);
        }
      });
    },
    // gets all of the targets specified by the 'on' property of an action
    getTargets(action, args) {
      // If using an ID, just give back a single item
      let selection;
      if (typeof action.on === 'string') {
        selection = document.querySelectorAll(action.on);
      } else if (typeof action.on === 'function') {
        selection = action.on(args);
        if (selection) {
          // If not an array, turn into an array
          if (selection.length === undefined) {
            selection = [selection];
          }
        } else {
          selection = [];
        }
      } else throw new Error(action._tag + ' on is not a string or function');

      return selection;
    },
    // Handles running an action
    //  - Checking to see if it needs to run
    //  - Loading required dependencies
    //  - Handling any errors thrown in the process
    //  - verbose the ending status of the action (unneeded|ran|errored)
    run(tag /* , ...additional arguments to pass on */) {
      if (this.actions[tag] === undefined) throw new Error(`No action defined with '${tag}' tag`);
      const action = this.actions[tag];
      const additionalargs = [];
      for (let i = 1; arguments[i] !== undefined; i += 1) {
        additionalargs.push(arguments[i]);
      }
      const targets = this.getTargets(action, additionalargs);
      if (targets.length) {
        waitForAll(this, action.dependencies, this.getResourceValue, (err) => {
          if (err) {
            console.error(err); // eslint-disable-line no-console
            verbose('❌ ' + tag);
            return;
          }
          // Add dependency values
          let anyfailed = false;
          const dependencies = action.dependencies.map(n => this.resources[n]._value);
          targets.forEach((target) => {
            try {
              action.run.apply(target, dependencies.concat(additionalargs));
            } catch (e) {
              e.message = `(from ${tag} action) ${e.message}`;
              console.warn(e); // eslint-disable-line no-console
              anyfailed = true;
            }
          });
          if (anyfailed) verbose('❌ ' + tag);
          else verbose('⚫ ' + tag);
        });
      } else {
        verbose('⚪ ' + tag);
      }
    },
    // Ran when the page loads
    onload() {
      Object.keys(this.actions).forEach(tag => Loader.run(tag));
    },
  };

  /* Additional consoles if in testing */
  verbose('Resources:', Loader.resources);
  verbose('Actions:', Loader.actions);

  /* Deal with competing versions */
  if (window.ByuiThemeLoader) {
    const other = window.ByuiThemeLoader;
    if (Loader.mode === 'development' || isLesserVersionNum(other.version, Loader.version)) {
      /* If they have a smaller version slice their throat */
      other.onload = () => {
        console.warn(`ByuiThemeLoader@${other.version} was replaced by version @${Loader.version}`); // eslint-disable-line no-console
        Loader.onload(); // piggy back off their event
      };
    } else {
      console.warn(`Couldn't use ByuiThemeLoader@${Loader.version} higher version @${other.version} exists on the page`); // eslint-disable-line no-console
    }
  } else {
    window.ByuiThemeLoader = Loader;
    window.addEventListener('load', () => Loader.onload());
  }

  /* -------- RESOURCES -------- */

  /* Prism */
  Loader.defineResource('Prism', {
    scripts: ['https://content.byui.edu/integ/gen/a40c34d7-9f6f-4a18-a41d-2f40e2b2a18e/0/codeHighlighter.js'],
    styles: ['https://content.byui.edu/integ/gen/a40c34d7-9f6f-4a18-a41d-2f40e2b2a18e/0/codeHighlighter.css'],
    findValue() {
      return window.Prism;
    },
  });

  /* Tippy */
  Loader.defineResource('Tippy', {
    scripts: ['https://content.byui.edu/integ/gen/a422cccd-35b7-4087-9329-20698cf169b0/0/tippy.all.min.js'],
    findValue() {
      return window.tippy;
    },
  });

  /* Slick */
  Loader.defineResource('Slick', {
    dependencies: ['jQuery'],
    scripts: ['https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min.js'],
    styles: [
      'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.css',
      'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick-theme.css',
    ],
  });

  /* JQuery */
  Loader.defineResource('jQuery', {
    scripts: ['https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js'],
    hasExistingInstance() {
      /* If jQuery is already on the page */
      if (window.jQuery !== undefined && window.jQuery().jquery !== undefined) {
        // check to see if version is above our minimum
        return isLesserVersionNum('1.7.0', window.jQuery().jquery);
      }
      return false;
    },
    findValue() {
      return window.jQuery.noConflict();
    },
  });

  /* Canvas API Modules */
  Loader.defineResource('Modules', {
    xhr: () => `/api/v1/courses/${document.location.pathname.split('/')[2]}/modules?per_page=100`,
  });

  /* Canvas API Teachers */
  Loader.defineResource('Teachers', {
    xhr: () => `/api/v1/courses/${document.location.pathname.split('/')[2]}/enrollments?type%5B%5D=TeacherEnrollment`,
  });


  /* -------- ACTIONS (alphabetical order) ------------ */

  /* Accordions */
  Loader.defineAction('Accordions', {
    on: '.byui div.accordion',
    dependencies: ['jQuery'],
    run($) {
      $(this).accordion({
        heightStyle: 'content',
        collapsible: true,
        active: false,
      });
    },
  });

  /* Bread Crumbs */
  Loader.defineAction('Breadcrumbs', {
    on() {
      /* If there are 4 total, AND we're inside a course AND we're not in a group tab */
      return document.querySelectorAll('#breadcrumbs li').length === 4
        && /\.com\/courses\/\d+\/(?!groups)/i.test(window.location.href);
    },
    run() {
      document.querySelector('#breadcrumbs li:nth-child(3) span').innerHTML = 'Modules';

      /* update the link */
      const link = document.querySelector('#breadcrumbs li:nth-child(3) a');
      link.href = link.href.replace(/\/\w+$/i, '/modules');
    },
  });

  /* Carousels */
  Loader.defineAction('Carousels', {
    on: '.byui .carousel',
    dependencies: ['jQuery', 'Slick'],
    run($) {
      $(this).slick({
        dots: true,
      });
    },
  });

  /* Code Highlighting */
  Loader.defineAction('CodeHighlighting', {
    on: '.byui pre code',
    dependencies: ['Prism'], // No action needs to be run, just Prism loaded
  });

  /* Copyright Footer */
  Loader.defineAction('CopyrightFooter', {
    on() {
      /* don't add one if it already exists */
      return !document.querySelector('p.copyright')
          && !document.querySelector('p#byui-copyright')
          && document.querySelector('#content');
    },
    run() {
      this.insertAdjacentHTML('beforeend', `<p id='byui-copyright'>Copyright ${new Date().getFullYear()} Brigham Young University-Idaho</p>`);
    },
  });

  /* Dialog */
  Loader.defineAction('Dialog', {
    on: '.byui .Button[id^="link_"]',
    dependencies: ['jQuery'],
    run($) {
      const matchingDialogId = this.id.replace('link_', '');
      const dialogBox = $('.byui #dialog_for_link_' + matchingDialogId);

      if (!dialogBox.length) throw new Error('No Associated Dialog Found');

      /* instantiate dialog */
      dialogBox.dialog({
        autoOpen: false,
      });

      /* add event listener to open dialog */
      this.addEventListener('click', (e) => {
        e.preventDefault();
        dialogBox.dialog('open');
      });
    },
  });

  /* Tiny MCE style changes */
  Loader.defineAction('EditorStyles', {
    on() {
      return window.tinyMCE;
    },
    run() {
      /* our css, canvas common css, canvas color vars css */
      const cssNames = [/byui\.css$/, /online\.css$/, /common[\w-]*\.css$/, /variables[\w-]*\.css$/, /campus\.css$/, /pathway\.css$/];

      /* Collect list of hrefs that match one of the cssNames */
      const cssHrefs = [];
      document.querySelectorAll('link[rel=stylesheet]').forEach((linkTag) => {
        const href = linkTag.getAttribute('href');
        /* only keep the link if it matches one of the regExes */
        if (cssNames.some(cssName => cssName.test(href))) {
          cssHrefs.push(href);
        }
      });
      /* For each editor, inject each stylesheet */
      window.tinyMCE.editors.forEach((editor) => {
        cssHrefs.forEach((href) => {
          editor.dom.styleSheetLoader.load(href);
        });
      });
    },
  });

  /* HomePage - Start */
  Loader.defineAction('Homepage.Start', {
    on: '.byui #navigation .steps #start',
    dependencies: ['Modules'],
    run(modules) {
      this.href = `/courses/${COURSE_NUMBER}/modules#module_${modules[0].id}`;
    },
  });

  /* HomePage - Tutorial */
  Loader.defineAction('Homepage.Tutorial', {
    on: '.byui #navigation .steps #tutorial',
    run() {
      this.href = 'http://byu-idaho.screenstepslive.com/s/16998/m/76692/l/865828-canvas-student-orientation?token=aq7F_UOmeDIj-6lBVDaXBdOQ01pfx1jw';
    },
  });

  /* HomePage - Resources */
  Loader.defineAction('Homepage.Resources', {
    on: '.byui #navigation .steps #resources',
    dependencies: ['Modules'],
    run(modules) {
      const resourcesModule = modules.find(canvasModule => /student\s*resources/i.test(canvasModule.name));

      // Report warning if we didn't run
      if (!resourcesModule) throw new Error('Couldn\'t find student resources module');

      this.href = `/courses/${COURSE_NUMBER}/modules#module_${resourcesModule.id}`;
    },
  });

  /* HomePage - Instructor */
  Loader.defineAction('Homepage.Instructor', {
    on: '.byui #navigation .steps #instructor',
    dependencies: ['Teachers'],
    run(teachers) {
      /* Remove duplicates */
      const teacherIds = teachers.map(teacher => teacher.user_id)
        .filter((teacherId, i, arr) => arr.indexOf(teacherId) === i);

      // If there are multiple unique teachers
      if (teacherIds.length > 1) throw new Error('Multiple teachers are enrolled in this course. Please add "Your Instructor" link manually.');
      // If the teacher isn't enrolled for some reason
      if (teacherIds.length === 0) throw new Error('Unable to find teacher enrollment.');
      // If we have one teacher set the URL
      this.href = `/courses/${COURSE_NUMBER}/users/${teacherIds[0]}`;
    },
  });

  /* Home Page - Lessons */
  Loader.defineAction('Homepage.Lessons', {
    on: '.byui #navigation .lessons.generate',
    dependencies: ['Modules'],
    run(modules) {
      /* Clear lesson wrapper */
      this.innerHTML = '';

      /* remove modules with invalid names & get modulesPerRow (limit 7) */
      const validModules = modules.filter(canvasModule => /(Week|Lesson|Unit)\s*(1[0-9]|0?\d(\D|$))/gi.test(canvasModule.name));
      const modulesPerRow = validModules.length > 7 ? 7 : validModules.length;

      /* generate module links */
      validModules.forEach((canvasModule, i) => {
        const moduleCount = (i < 10 ? '0' : '') + (i + 1);
        this.insertAdjacentHTML('beforeend', `<a href='/courses/${COURSE_NUMBER}/modules#module_${canvasModule.id}' style='width: calc(100% / ${modulesPerRow} - 20px);'>${moduleCount}</a>`);
      });
    },
  });

  /* QuizzesNext NewQuiz ToolTip */
  Loader.defineAction('ToolTips.onNewQuiz', {
    on: '#application .new_quiz_lti_wrapper',
    dependencies: ['Tippy'],
    run(tippy) {
      insertToolTipHeaders('black', `Be sure to periodically review the <a href="${QUIZZES_NEXT_FAQ}" target="_blank">Quizzes.Next FAQs</a> to keep updated on new features`);

      tippy('#application .new_quiz_lti_wrapper', {
        html: '#' + TOOLTIP_ID,
        interactive: true,
        placement: 'bottom-end',
        theme: 'byui',
        size: 'large',
      });
    },
  });

  /* QuizzesNext Settings ToolTip */
  Loader.defineAction('ToolTips.onSettings', {
    on: '.course-feature-flags .quizzes_next',
    dependencies: ['Tippy'],
    run(tippy) {
      insertToolTipHeaders('red', `Please review <a href="${QUIZZES_NEXT_FAQ}" target="_blank">these FAQs</a> to see the benefits and cautions before using Quizzes.Next`);

      tippy('.course-feature-flags .quizzes_next', {
        html: '#' + TOOLTIP_ID,
        interactive: true,
        placement: 'bottom-end',
        theme: 'byui',
        size: 'large',
      });
    },
  });


  // NOTE: google training course
  /* Tabs */
  Loader.defineAction('Tabs', {
    on: '.byui #styleguide-tabs-demo-minimal',
    dependencies: ['jQuery'],
    run($) {
      $(this).tabs();
    },
  });

  /* Video Tags */
  Loader.defineAction('VideoTags', {
    on: '.byui-video',
    run() {
      if (this.dataset.source === 'youtube') {
        this.innerHTML = `<iframe width="${this.dataset.width}px" height="${this.dataset.height}px" src="https://www.youtube.com/embed/${this.dataset.vidid}" frameborder="0" allowfullscreen></iframe>`;
      } else if (this.dataset.source === 'kaltura') {
        this.innerHTML = `<iframe width="${this.dataset.width}px" height="${this.dataset.height}px" src="https://cdnapisec.kaltura.com/p/1157612/sp/115761200/embedIframeJs/uiconf_id/29018071/partner_id/1157612?iframeembed=true&amp;playerId=kaltura_player_1485805514&amp;entry_id=${this.dataset.vidid}&amp;flashvars[streamerType]=auto" frameborder="0" allowfullscreen></iframe>`;
      } else {
        throw new Error('Video not from youtube or kaltura');
      }
    },
  });

  /* ------- UTILS -------- */
  const TOOLTIP_ID = 'byui-quizzes-next-tooltip';
  const QUIZZES_NEXT_FAQ = 'http://byu-idaho.screenstepslive.com/s/14177/m/73336/l/970385-quizzes-next-faq-s';
  const COURSE_NUMBER = document.location.pathname.split('/')[2];

  function isLesserVersionNum(a, b) {
    const A = a.split('.');
    const B = b.split('.');
    while (A.length < B.length) A.unshift(0);
    while (B.length < A.length) B.unshift(0);
    for (let i = 0; i < A.length; i += 1) {
      if (+A[i] > +B[i]) return false;
      if (+A[i] < +B[i]) return true;
    }
    return false;
  }

  function waitForAll(that, datums, eachfn, cb) {
    if (datums.length === 0) {
      cb.call(that, null);
      return;
    }

    let counter = 0;
    let errorThrown = false;

    function oneach(err) {
      if (!errorThrown) {
        if (err) {
          errorThrown = true;
          cb.call(that, err);
        } else {
          counter += 1;
          if (counter === datums.length) cb.call(that, null);
        }
      }
    }
    datums.forEach(data => eachfn.call(that, data, oneach));
  }

  function verbose(tag, object) {
    /* eslint-disable no-console */
    if (Loader.mode === 'development') {
      if (arguments.length === 2 && typeof tag === 'string' && typeof object === 'object') {
        console.groupCollapsed(tag);
        console.log(object);
        console.groupEnd();
      } else {
        console.log(...arguments);
      }
    }
    /* eslint-enable no-console */
  }

  function loadScript(href, cb) {
    if (!document.querySelector('script[src="' + href + '"]')) {
      verbose('Loading Script from ' + href);
      const script = document.createElement('script');
      script.dataset.readyState = 'loading';
      script.src = href;
      // Call the callback once it is done loading
      if (cb) {
        script.addEventListener('load', () => cb(null), {
          once: true,
        });
        script.addEventListener('error', () => cb(new Error('Error loading ' + href)), {
          once: true,
        });
      }
      // Append to head of document
      document.head.appendChild(script);
    }
  }
  function loadStyle(href) {
    // Already injected?
    if (document.querySelector('link[href="' + href + ']"') === null) {
      verbose('Loading Stylesheet from ' + href);
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.href = href;
      // Append to head of document
      document.head.appendChild(link);
    } else {
      verbose('Already Loaded Stylesheet from ' + href);
    }
  }

  function xhttpRequest(url, cb) {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function onreadystatechange() {
      try {
        if (this.readyState === 4) {
          if (this.status === 200) {
            const data = JSON.parse(xhttp.responseText);
            cb(null, data);
          } else {
            cb(new Error('Failed to retrieve, got a status code ' + this.status));
          }
        }
      } catch (err) {
        cb(err);
      }
    };
    xhttp.open('GET', url, true);
    xhttp.setRequestHeader('accept', 'application/json, text/javascript, application/json+canvas-string-ids, */*; q=0.01');
    xhttp.send();
  }

  function insertToolTipHeaders(color, tip) {
    document.head.insertAdjacentHTML('beforeend', `<div id="${TOOLTIP_ID}" style="display: none;">${tip}</div>`);
    document.head.insertAdjacentHTML('beforeend', `
      <style>
          .tippy-tooltip.byui-theme {
              border: 2px solid ${color};
              background-color: white;
              color: black;
              max-width: 200px;
          }
          .tippy-backdrop {
              background: white;
          }
      </style>
    `);
  }

})(); // End IFFY
