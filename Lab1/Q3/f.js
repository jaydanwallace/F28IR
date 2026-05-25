async function f() {

    let result = 'first!';

    let promise = new Promise((resolve, reject) => {

      setTimeout(() => resolve('done!'), 1000);

    });

    promise
        .then(value => {
            result = value;
            console.log(result);
        })
        .catch(error => {
            console.log(error);
        })
        .finally(() => {
            console.log('promise settled');
        });

}

f();