RUNMODE=$1

if [ "$RUNMODE" == "" ]; then
  RUNMODE="headless"
fi

if [ "$RUNMODE" == "ui" ]; then
  echo
  echo -e "\033[34mOpen Cypress UI...\033[0m"
  cypress open
else
  {
    echo
    echo -e "\033[34mCypress run...\033[0m"
    cypress run --reporter mochawesome --spec 'cypress/integration/index.spec.js'
  } || {
    EXIT_CODE=1
  }
fi

exit $EXIT_CODE
