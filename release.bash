# Generate IE friendly minified file at root
babel jquery.sumoselect.js -o jquery.sumoselect.min.js

# Generate minified CSS
minify sumoselect.css > sumoselect.min.css

# Copy minified files in docs
shx cp jquery.sumoselect.min.js docs/javascripts
shx cp sumoselect.min.css docs/stylesheets

# Commit those changes
git add docs/javascripts/jquery.sumoselect.min.js
git add docs/stylesheets/sumoselect.min.css
git add jquery.sumoselect.min.js 
git add jquery.sumoselect.js
git add sumoselect.min.css
git diff-index --quiet HEAD || git commit -m "chore: Files minification"

# Release
standard-version