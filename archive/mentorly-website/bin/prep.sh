#!/bin/bash
execute() {
  typeset script="$*"
  typeset error

  echo running: $script ...
  eval $script
  error=$?
  if [ $error != 0 ]; then
    printf "Error: [%d] from script: '$script'" $error
    exit $error
  fi
}

execute "npm run lint:fix"
execute "npm run check-types"
execute "npm run test"
execute "npm run build"
execute "git add ."
execute "git commit -m 'prep'"
execute "git config push.default current"
execute "git push"
