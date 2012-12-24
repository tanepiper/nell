<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" type="text/css" href="/css/bootstrap.css" />
    <link rel="stylesheet" type="text/css" href="/css/bootstrap-responsive.css" />
    <link rel="stylesheet" type="text/css" href="/js/codemirror/lib/codemirror.css" />
        
    <script src="/js/codemirror/lib/codemirror.js"></script>
  </head>
  <body>
    <section class="container-fluid">
      <section="row-fluid">
        <header class="navbar navbar-fixed-static top">
          <section class="navbar-inner">
            <a class="brand">NellIDE</a>
            <ul class="nav">
              <li><a href="/">Dashboard</a></li>
            </ul>
        </header>
        
       <section class="dashboard">
        <section class="code-entry span6">
          <textarea id="code" name="code">
### Some content
Foo Bar
          </textarea>
        </section>
        
        <section class="html-output span6">
          <iframe id="preview"></iframe>
        </section>
      </section>
      </section>
    </section>
  </body>
  <script type="text/javascript">
      var delay;
      // Initialize CodeMirror editor with a nice html5 canvas demo.
      var editor = CodeMirror.fromTextArea(document.getElementById('code'), {
        mode: 'text/html',
        tabMode: 'indent'
      });
      editor.on("change", function() {
        clearTimeout(delay);
        delay = setTimeout(updatePreview, 300);
      });
      
      function updatePreview() {
        var previewFrame = document.getElementById('preview');
        var preview =  previewFrame.contentDocument ||  previewFrame.contentWindow.document;
        preview.open();
        preview.write(editor.getValue());
        preview.close();
      }
      setTimeout(updatePreview, 300);
    </script>
</html>