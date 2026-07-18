import "./App.css";
import { useEffect, useState, useCallback } from "react";

function App() {
  const [name, setName] = useState('');
  const [datetime, setDatetime] = useState('');
  const [description, setDescription] = useState('');
  const [transactions, setTransactions] = useState([]);

  const baseUrl = process.env.REACT_APP_API_URL;
  const transactionUrl = `${baseUrl}/server/transaction`;

  // Wrapped in useCallback so it can safely be added to dependency arrays if needed
  const getTransactions = useCallback(async () => {
    try {
      const response = await fetch(`${baseUrl}/server/transactions`);
      const data = await response.json();
      setTransactions(data);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    }
  }, [baseUrl]);

  useEffect(() => {
    getTransactions();
  }, [getTransactions]);

  function addNewTransaction(ev) {
    ev.preventDefault();

    const firstWord = name.split(' ')[0]; 
    const cleanPrice = parseFloat(firstWord.replace('+', ''));
    const cleanName = name.substring(firstWord.length + 1);

    fetch(transactionUrl, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({
        price: isNaN(cleanPrice) ? 0 : cleanPrice,
        name: cleanName,
        description,
        datetime
      })
    }).then(response => {
      response.json().then(json => {
        setName('');
        setDatetime('');
        setDescription('');
        console.log('result', json);
        // Refresh the list seamlessly after adding a new one
        getTransactions(); 
      })
    });
  }

  let balance = 0;
  for (const transaction of transactions) {
    balance = balance + transaction.price;
  }

  balance = balance.toFixed(2);
  const fraction = balance.split('.')[1];
  balance = balance.split('.')[0];


  return (
    <main>
      <h1>${balance}<span>{fraction}</span></h1>
      <form onSubmit={addNewTransaction}>
        <div className="basic">
          <input type="text" value={name} onChange={ev => setName(ev.target.value)} placeholder={"+200 new samsung tv"} />
          <input value={datetime} onChange={ev => setDatetime(ev.target.value)} type="datetime-local" />
        </div>
        <div className="description">
          <input type="text" value={description} onChange={ev => setDescription(ev.target.value)} placeholder={"description"} />
        </div>
        <button type="submit">Add new transaction</button>
      </form>
      <div className="transactions">
        {transactions.length > 0 && transactions.map((transaction, index) => (
          <div key={transaction._id || index}> 
            <div className="transaction">
              <div className="left">
                <div className="name">{transaction.name}</div>
                <div className="description">{transaction.description}</div>
              </div>
              <div className="right">
                <div className={"price " + (transaction.price < 0 ? 'red' : 'green')}>
                  {transaction.price}
                </div>
                <div className="datetime">
                  {transaction.datetime ? new Date(transaction.datetime).toLocaleString() : ''}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default App;