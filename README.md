#QualiSystems Execution Monitoring

###Description
A Simple Node Application that Monitors the Stuatus of QualiSystem Reservations and if any anomolies are found send an email to the appropriate personnel.

####Algorithm Logic
This utility performs the necessary actions in this manner:

* Login to system being Monitored, Get Current Reservations, Check Reservations for Errors; this Occurs on a 5 Minute Interval
* If an Error is Encountered, Emit an Error Event using Nodejs EventEmitter and set the inError to TRUE
* Return control back into 5 minute interval AND Process 'ON' Error Event
* On Error if the SendInitial var is FALSE, Send an Email, Set a new Value to TRUE, Activate New Interval that Sends Emails to the LIST every Hour as long as the Error Persists
* When the Error is Cleared, in the Normal 5 Minute Interval Return Data from Current Reservations will have a Length of 0 and inError will Still be TRUE, Clear the Email Interval by calling the Function with TRUE as a parameter
  * The Email Interal uses a GLOBAL VAR to reference the Hourly Interval; here we clear that Variable with the clearInterval(intRef) function
* Set SendInitial and inError boolean to TRUE (send email next time error is encounter) and FALSE (we are no longer in error)

####ToDo
* Monitor external server log files for errors (no need to call api)
* better error checking
