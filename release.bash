# Copy source file at root
shx cp src/jquery.sumoselect.js ./

# Generate IE friendly minified file at root
babel src -o jquery.sumoselect-ie.min.js
browserify jquery.sumoselect-ie.min.js | uglifyjs > jquery.sumoselect.min.js
rm jquery.sumoselect-ie.min.js

# Copy minified file in docs
shx cp jquery.sumoselect.min.js docs/javascripts

# Commit those changes
git add docs/javascripts/jquery.sumoselect.min.js
git add jquery.sumoselect.min.js 
git add jquery.sumoselect.js
git diff-index --quiet HEAD || git commit -m "chore: Files minification"

# Release
standard-version