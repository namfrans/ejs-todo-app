module.exports =  function toDay(){
  var options = {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  };
  var today = new Date();
  var day = today.toLocaleDateString("en-US", options);
  return day;
}
