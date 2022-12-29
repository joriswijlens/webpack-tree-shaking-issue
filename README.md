# This code is meant to reproduce a webpack issue

Unfortunately the problem is quite hard to reproduce so, I had to strip the code of our production service.
I tried to strip it to the bare minimum but almost every change from now on causes the error message to disappear.

## Steps to reproduce
- nvm use 
- npm i
- npm run build
- npm run start
- move to other shell
- npm run layout
- access http://localhost:8080/template
- open devtools console to see the error

## Problem description
- summary fragment cannot find [hello function](./src/client/fragments/summary/index.js) in [featureToggle reducer](src/client/reducers/featureToggle.js)
- the same [featureToggle reducer](src/client/reducers/featureToggle.js) is also used in the [checkout fragment](src/client/fragments/checkout)
- the checkout fragment uses the getToggles and the default export
- somehow the first? loaded module by checkout is also used by the summary
- almost every further change makes the error disappear, see comments in the code