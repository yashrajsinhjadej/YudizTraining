// const promise = new Promise((resolve, reject) => {
//     setTimeout(function () {
//         let error = true;
//         if (error) {
//             resolve({ username: 'parv', password: '1234' });
//         }
//         else {
//             reject('Error: Something went wrong');
//         }
//     }, 1000);
// });

// promise
// .then((user) => {
//     // console.log(user);
//     return user.username
// })
// .then((username) => {
//     console.log(username);
// })
// .catch(() => {
//     console.log('Error');
// })
// .finally(() => {
//     console.log('Finally All Done');
// });



// const promiseOne = new Promise((resolve,reject) => {
//     setTimeout(function(){
//         let error = true;
//         if(error){
//             resolve({username: 'parv', password: '1234'});
//         }
//         else{
//             reject('Error: Something went wrong');
//         }
//     },1000)
// })

// fetch('https://api.github.com/users/hiteshchoudhary')
// .then((response) => {
//     return response.json();
// })
// .then((data) => {
//     console.log(data);
// })
// .catch((error) => {
//     console.log(error);
// })


// async function consumepromise(){
//     try {
//         const response = await promise;
//         console.log(response);  
//     } 
//     catch (error) { 
//         console.log(error);
//     }
// }
// consumepromise();


// async function getUserData(){
//     try {
//         const response = await fetch('https://jsonplaceholder.typicode.com/posts')
//         const data = await response.json();
//         console.log(data);
//     } catch (error) {
//         console.log("E: ",error);
//     }
// }
// getUserData();


function traverseDOM() {
    // Get the second box
    let box2 = document.getElementById("box2");
    
    // Get the parent of box2
    let parent = box2.parentNode;
    console.log("Parent of Box 2:", parent);

    // Get all children of the container
    let children = parent.children;
    console.log("Children of Container:", children);

    // Get the first and last child
    let firstChild = parent.firstElementChild;
    let lastChild = parent.lastElementChild;
    console.log("First Child:", firstChild);
    console.log("Last Child:", lastChild);

    // Get next and previous siblings of box2
    let nextSibling = box2.nextElementSibling;
    let prevSibling = box2.previousElementSibling;
    console.log("Next Sibling of Box 2:", nextSibling);
    console.log("Previous Sibling of Box 2:", prevSibling);

    // Highlight traversed elements
    box2.classList.add("highlight"); // Highlight current element
    parent.style.border = "2px solid red"; // Highlight parent
    if (nextSibling) nextSibling.classList.add("highlight");
    if (prevSibling) prevSibling.classList.add("highlight");
}