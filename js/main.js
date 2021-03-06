'use strict';

//USER DATA API

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
    owner: 'Jonas Schmedtmann',
    movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
    interestRate: 1.2, // %
    pin: 1111,

    movementsDates: [
        '2019-11-18T21:31:17.178Z',
        '2019-12-23T07:42:02.383Z',
        '2020-01-28T09:15:04.904Z',
        '2020-04-01T10:17:24.185Z',
        '2020-05-08T14:11:59.604Z',
        '2021-11-18T17:01:17.194Z',
        '2021-11-20T23:36:17.929Z',
        '2021-11-22T10:51:36.790Z',
    ],
    currency: 'NGN',
    locale: 'en-NG', // de-DE
};

const account2 = {
    owner: 'Jessica Davis',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,

    movementsDates: [
        '2019-11-01T13:15:33.035Z',
        '2019-11-30T09:48:16.867Z',
        '2019-12-25T06:04:23.907Z',
        '2020-01-25T14:18:46.235Z',
        '2020-02-05T16:33:06.386Z',
        '2020-04-10T14:43:26.374Z',
        '2020-06-25T18:49:59.371Z',
        '2020-07-26T12:01:20.894Z',
    ],
    currency: 'USD',
    locale: 'en-US',
};

const accounts = [account1, account2];
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
const containerNav = document.querySelector('.nav')


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

//FUNCTIONS
const formatMovementDate = (date, locale) => {
    const calcDaysPassed = (date1, date2) => Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
    const daysPassed = calcDaysPassed(new Date(), date)
    console.log(daysPassed)
    if (daysPassed === 0) return `Today`;
    if (daysPassed === 1) return `Yesterday`;
    if (daysPassed <= 7) return `${daysPassed} days ago`;

    //else display transaction date
    // const currentDate = `${date.getDate()}`.padStart(2, "0")///(showlenth, addWhen length is single)
    // const currentMonth = `${date.getMonth() + 1}`.padStart(2, "0")
    // const currentYear = date.getFullYear();

    // return `${currentDate}/${currentMonth}/${currentYear}`;

    return new Intl.DateTimeFormat(locale).format(date)
}


//formatted currency reusable function
const formatCur = (value, locale, currency) => {
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency,
    }).format(value);
}

/**DISPLAY MOVEMENTS FUNCTION**/
const displayMovements = (acc, sort = false) => {
    containerMovements.innerHTML = "";
    //make a copy of the movements and then sort
    const movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;
    movs.forEach((mov, i) => {
        const type = mov > 0 ? "deposit" : "withdrawal";
        //movementDate time setter
        const date = new Date(acc.movementsDates[i]);

        const displayDate = formatMovementDate(date, acc.locale);

        const formattedMov = formatCur(mov, acc.locale, acc.currency);

        const html = `
        <div class="movements__row">
                <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
               <div class="movements__date">${displayDate}</div>
                <div class="movements__value">${formattedMov}</div>
        </div>
        `
        containerMovements.insertAdjacentHTML("afterbegin", html)
    });

}
// displayMovements(account1.movements)

/*FUNCTION THAT CALCULATE AND DISPLAY BALANCE */

const calcDisplayBalance = (acc) => {
    // const formattedMov = formatCur(mov, acc.locale, acc.currency);

    acc.balance = acc.movements.reduce((ac, mov) => ac + mov, 0)
    labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
}
// calcDisplayBalance(account1)




/*FUNCTION THAT CALCULATE AND DISPLAY SUMMARY */
const calcDisplaySummary = (acc) => {
    acc.income = acc.movements.filter((mov) => mov > 0).reduce((ac, mov) => ac + mov, 0);

    //display Income summary
    labelSumIn.textContent = formatCur(acc.income, acc.locale, acc.currency)

    acc.outgoing = acc.movements.filter((mov) => mov < 0).reduce((acc, mov) => acc + mov, 0);

    //display Outgoing summary
    labelSumOut.textContent = formatCur(`${Math.abs(acc.outgoing)}`, acc.locale, acc.currency)


    acc.interest = acc.movements.filter((mov) => mov > 0)
        //formula that calc % of the desposit
        .map((desposit) => desposit * acc.interestRate / 100)
        .filter((int) => int >= 1)
        .reduce((ac, int) => ac + int, 0)
    // display interest
    labelSumInInterest.textContent = formatCur(acc.interest, acc.locale, acc.currency);
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
    //display movements
    displayMovements(acc)
    //display balance
    calcDisplayBalance(acc)
    //display summary
    calcDisplaySummary(acc)
}


let currentAccount;
currentAccount = account1;
updateUI(currentAccount);
containerApp.style.opacity = 100;




btnLogin.addEventListener("click", (e) => {
    e.preventDefault();
    currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
    console.log(currentAccount)
    if (currentAccount.pin === Number(inputLoginPin.value)) {
        //display app UI
        containerApp.style.opacity = 100;
        //display login accout name
        labelWelcome.textContent = `Welcome Back ${currentAccount.owner.split(" ")[0]}`
        //Create transfer dates


        const now = new Date();
        //setter second parameter
        const options = {
            hour: "numeric",
            minute: "numeric",
            day: "numeric",
            month: "numeric",
            year: "numeric"
        }
        //how to get a locale from user browser
        // const locale = navigator.language;

        labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale, options).format(now)




        // const now = new Date();
        // const currentDate = `${now.getDate()}`.padStart(2, "0")
        // const currentMonth = now.getMonth() + 1;
        // const currentYear = now.getFullYear();
        // const currentHour = `${now.getHours()}`.padStart(2, "0")
        // const currentMinute = `${now.getMinutes()}`.padStart(2, "0")
        // labelDate.textContent = `${currentDate}/${currentMonth}/${currentYear} ${currentHour}:${currentMinute}`;


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
        //push the debit money to the currentAccout and create transfer date
        currentAccount.movements.push(-amount);
        currentAccount.movementsDates.push(new Date().toISOString());
        //push the amount and create transfer date
        recieverAcc.movements.push(amount);
        recieverAcc.movementsDates.push(new Date().toISOString());
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
    const loanAmount = Math.floor(inputLoanAmount.value);
    console.log(loanAmount)

    const bankCondition = currentAccount.movements.some(mov => mov >= loanAmount * 0.1)
    console.log(bankCondition)

    if (loanAmount > 0 && bankCondition) {
        //push the loan request amount and create loan time
        currentAccount.movements.push(loanAmount);
        currentAccount.movementsDates.push(new Date().toISOString());
    }
    //update UI
    updateUI(currentAccount)

    //clear field
    inputLoanAmount.value = ""
    inputLoanAmount.blur();


})

btnClose.addEventListener("click", (e) => {
    e.preventDefault();
    if (inputCloseUser.value === currentAccount.username &&
        Number(inputClosePassword.value) === currentAccount.pin) {
        //find the index of the current account
        const index = accounts.findIndex(acc => acc.username === currentAccount.username);

        //delete current
        accounts.splice(index, 1)
        containerApp.style.opacity = 0;



    }
    //clear field 
    inputCloseUser.value = inputClosePassword.value = ""
    inputClosePassword.blur();

})

let sorted = false
btnSort.addEventListener("click", (e) => {
    e.preventDefault();
    displayMovements(currentAccount.movements, !sorted);
    sorted = !sorted
})

// const num = 3245672.82;
// const options = {
//     style: "currency",
//     // unit: "celsius"
//     currency: "NGN"
// }
// console.log('NG:' + new Intl.NumberFormat('en-NG', options).format(num));
// console.log('US:' + new Intl.NumberFormat('en-US', options).format(num))
// console.log('SY:' + new Intl.NumberFormat('ar-SY', options).format(num))