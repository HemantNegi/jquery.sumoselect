# Generate IE friendly minified file at root
babel jquery.sumoselect.js -o jquery.sumoselect.min.js

# Generate minified CSS
minify sumoselect.css > sumoselect.min.css

# Copy minified files in docs
shx cp jquery.sumoselect.min.js docs/javascripts
shx cp sumoselect.min.css docs/stylesheets