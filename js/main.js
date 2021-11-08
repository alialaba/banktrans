'use strict';
/*******FUNCTION FOR SWITCHING TABS */
const openForm = (evt, formName) => {
    let i, tabcontent, tablinks;

    tabcontent = document.getElementsByClassName("tab-content")
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tab")
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "")
    }

    document.getElementById(formName).style.display = "block";
    evt.currentTarget.className += " active";

}

window.addEventListener("load", (event) => {
    document.getElementById('login').style.display = "block";
    document.getElementById('signup').style.display = "none";

})


//USER DATA API

const account1 = {
    owner: 'Jonas Schmedtmann',
    movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
    interestRate: 1.2, // %
    pin: 1111,
};

const account2 = {
    owner: 'Jessica Davis',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,
};

const account3 = {
    owner: 'Steven Thomas Williams',
    movements: [200, -200, 340, -300, -20, 50, 400, -460],
    interestRate: 0.7,
    pin: 3333,
};

const account4 = {
    owner: 'Sarah Smith',
    movements: [430, 1000, 700, 50, 90],
    interestRate: 1,
    pin: 4444,
};

const accounts = [account1, account2, account3, account4];

//DOM ELEMENTS
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector('.balance__date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out")
const labelSumInInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer")

const containerMovements = document.querySelector(".movements");
const containerApp = document.querySelector(".app");
const containerNav = document.querySelector('.navbar')

const btnLogin = document.querySelector(".login__btn");
const btnClose = document.querySelector(".form__btn--close");
const btnLoan = document.querySelector(".form__btn--loan");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputCloseUser = document.querySelector(".form__input--user");
const inputClosePassword = document.querySelector(".form__input--pin");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");

/**DISPLAY MOVEMENTS FUNCTION**/
const displayMovements = (movements) => {

    containerMovements.innerHTML = "";
    movements.forEach((mov, i) => {
        const type = mov > 0 ? "deposit" : "withdrawal";
        const html = `
        <div class="movements__row">
                <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
                <div class="movements__value">${mov}€</div>
        </div>
        `

        containerMovements.insertAdjacentHTML("afterbegin", html)
    });

}
// displayMovements(account1.movements)


/*FUNCTION THAT CALCULATE AND DISPLAY BALANCE */

const calcDisplayBalance = (acc) => {
    acc.balance = acc.movements.reduce((ac, mov) => ac + mov, 0)
    labelBalance.textContent = `${acc.balance}€`
}
// calcDisplayBalance(account1)




/*FUNCTION THAT CALCULATE AND DISPLAY SUMMARY */
const calcDisplaySummary = (acc) => {
    acc.income = acc.movements.filter((mov) => mov > 0).reduce((ac, mov) => ac + mov, 0);

    //display Income summary
    labelSumIn.textContent = `${acc.income}€`;

    acc.outgoing = acc.movements.filter((mov) => mov < 0).reduce((acc, mov) => acc + mov, 0);

    //display Outgoing summary
    labelSumOut.textContent = `${Math.abs(acc.outgoing)}€`


    acc.interest = acc.movements.filter((mov) => mov > 0)
        //formula that calc % of the desposit
        .map((desposit) => desposit * acc.interestRate / 100)
        .filter((int) => int >= 1)
        .reduce((ac, int) => ac + int, 0)
    // display interest
    labelSumInInterest.textContent = `${acc.interest}€`;
}
// calcDisplaySummary(account1)


/*FUNCTION THAT COMPUTE USER PASSWORD */
const computeUsername = (accs) => {
    accs.forEach((acc) => {
        acc.username = acc.owner.toLowerCase()
            .split(" ")
            .map((firstLetter) => firstLetter[0])
            .join("")
    })

}
computeUsername(accounts)

const updateUI = (acc) => {
    displayMovements(acc.movements)
    calcDisplayBalance(acc)
    calcDisplaySummary(acc)
}


let currentAccount
btnLogin.addEventListener("click", (e) => {
    e.preventDefault();
    currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
    console.log(currentAccount)
    if (currentAccount.pin === Number(inputLoginPin.value)) {
        //display app UI
        containerApp.style.opacity = 100;
        containerNav.style.opacity = 100;
        //display login accout name
        labelWelcome.textContent = `Welcome Back ${currentAccount.owner.split(" ")[0]}`
    } else {
        alert("Invalid login credentials")
    }

    //clear input fields
    inputLoginPin.value = inputLoginUsername.value = ""

    //loss focus on the input using blur
    inputLoginPin.blur();

    //display update function
    updateUI(currentAccount);
})


btnTransfer.addEventListener("click", (e) => {
    e.preventDefault();
    const amount = Number(inputTransferAmount.value);
    console.log(amount)
    const recieverAcc = accounts.find((acc) => acc.username === inputTransferTo.value);
    console.log(recieverAcc)

    if (amount > 0 && currentAccount.balance >= amount && recieverAcc?.username !== currentAccount.username) {
        //push the debit money to the currentAccout
        currentAccount.movements.push(-amount);
        //push the amount
        recieverAcc.movements.push(amount);
    }


    //update UI
    updateUI(currentAccount)
    //clear field input
    inputTransferTo.value = inputTransferAmount.value = ""

    //loss focus on the input using blur
    inputTransferAmount.blur();

})

btnLoan.addEventListener("click", (e) => {
    e.preventDefault();
    const loanAmount = Number(inputLoanAmount.value);
    console.log(loanAmount)

    const bankCondition = currentAccount.movements.some(mov => mov >= loanAmount * 0.1)
    console.log(bankCondition)

    if (loanAmount > 0 && bankCondition) {
        //push the loan request amout
        currentAccount.movements.push(loanAmount);
    }
    //update UI
    updateUI(currentAccount)

    //clear field
    inputLoanAmount.value = ""
    inputLoanAmount.blur();


})
