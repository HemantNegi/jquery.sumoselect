# Commit changes
git add docs/javascripts/jquery.sumoselect.min.js
git add docs/stylesheets/sumoselect.min.css
git add jquery.sumoselect.min.js 
git add jquery.sumoselect.js
git add sumoselect.min.css
git diff-index --quiet HEAD || git commit -m "chore: Files minification"

# Release
standard-version