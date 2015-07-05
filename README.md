#QualiSystems Execution Monitoring

###Description
A Simple Node Application that Monitors the Stuatus of QualiSystem Reservations and if any anomolies are found send an email to the appropriate personnel.

####Algorithm Logic

* This utility performs the necessary actions in this manner:
  * Uses EventEmitter to Emit System Errors
  * Uses 2 Global Boolean Variables
    * SendInitial default is TRUE; when error is found we want to send an Email straightaway
    * inError default is FALSE; we assume no errors exist
  * Set 5 Minute Interval to Perform Error Checks (this Runs indefinitely)
  * Get Quali Instance and perform Login
  * Call CheckforErrors Function; Returns a Promise AND/OR Emits Error when error conditions are found.

``` javascript
if (errors.length > 0) {
  qualiEvent.emit('quali-error', errors); //Emits Error
  inError = true;
  return errors; //Return the Promise to the 5 Minute Interval
}
```

  * In the event.on(''):
    * process the Errors and create Email Body.
    * check value of SendInital (first TIME is true)
      * If True: Send Email, Turn On Hourly Email Interval (as long as errors persist), Change SendIntial to FALSE (this block of code will not run again)

```javascript
if (sendIntial) {
  emailer.sendMail(msg);
  emailInterval(false); //Do not clear the Interval (false)
  sendInitial = false;
}
```

  * When Errors No Longer Persist the CheckErrors Promise will have a Length of 0 and the inError Boolean will be True

```javascript
if (error.length === 0 && inError) {
  emailInterval(true); //CLEAR the Hourly Interval
  sendInital = true; //RESET to Default
  inError = false; //RESET to Default
}
```


####ToDo
* Monitor external server log files for errors (no need to call api)
* better error checking
