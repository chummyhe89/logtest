var arr = new Array;
arr[0] = 'a';
arr[1] = 'b';
for (var i in arr)
{
console.log(i);
}
var usersImei = {};
var imeis = ['12','34','56'];
var sessions = [{'s':'1'},{'s':'2'}];
if(typeof usersImei[imeis[0]] == 'undefined') usersImei[imeis[0]] = [];
usersImei[imeis[0]].push(sessions[0]);
usersImei[imeis[0]].push(sessions[1]);
console.log(usersImei);
