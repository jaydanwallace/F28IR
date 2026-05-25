function job(data) {
      let num = parseInt(data,10);
      return new Promise((resolve, reject) => {
          if(num===1) resolve('10');
          else if(num===10) resolve('100');
          else reject('error');
      });
}
//We wrote the following code to use job() to generate 111 by adding 100 + 10 + 1:
let promise = job(1);
let total = 0;

promise
.then(value1 => 
{
    total += parseInt(value1, 10);
    return job(value1);
})
.then(value2 => 
{
    total += parseInt(value2, 10);   
  console.log(total + 1); 
})
.catch(function(reject) 
{
  console.log(reject);
});