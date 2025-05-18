import React, { useCallback, useEffect, useState } from 'react';
// import { Link } from "react-router-dom";

const EMICalculator = () => {
  const [loanAmount, setLoanAmount] = useState(500000);
  const [interestRate, setInterestRate] = useState(7.5);
  const [tenure, setTenure] = useState(60); // always stored in months
  const [tenureType, setTenureType] = useState("months"); // "months" or "years"

  const [emi, setEmi] = useState(null);
  const [totalInterest, setTotalInterest] = useState(null);
  const [totalPayment, setTotalPayment] = useState(null);

  const calculateEMI = useCallback(() => {
    const principal = parseFloat(loanAmount);
    const rate = parseFloat(interestRate) / 12 / 100;
    const months = parseInt(tenure);

    const emiCalc =
      (principal * rate * Math.pow(1 + rate, months)) /
      (Math.pow(1 + rate, months) - 1);

    const totalPay = emiCalc * months;
    const totalInt = totalPay - principal;

    setEmi(emiCalc.toFixed(2));
    setTotalPayment(totalPay.toFixed(2));
    setTotalInterest(totalInt.toFixed(2));
  }, [loanAmount, interestRate, tenure]);

  useEffect(() => {
    calculateEMI();
  }, [calculateEMI]);

  return (
    <>
      <div className="ui inverted blue menu" style={{ position: 'sticky', top: 0, zIndex: 1000, minHeight: '70px' }}>
        <div className="ui container">
          <h3 className="header item" style={{ margin: 0 }}>
            🔢 EMI Calculator – Easy, Fast & Free!
          </h3>
          <div className="right menu">
            <a href="/" className="item">
              Home
            </a>
            <a href="/about" className="item">
              About Us
            </a>
            <a href="/contact" className="item">
              Contact Us
            </a>
          </div>
        </div>
      </div>

      <div className="ui container" style={{ paddingBottom: '15px', maxWidth: '650px' }}>
        <div className="ui raised very padded text container segment">
          <h2 className="ui teal header center aligned">EMI Calculator</h2>

          <form className="ui form">
            {/* Loan Amount */}
            <div className="field" style={{ marginBottom: '30px' }}>
              <label style={{ fontSize: "1.2rem" }}>Personal Loan Amount (₹)</label>
              <input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                placeholder="Enter loan amount"
              />
              <div className="ui fluid slider" style={{ marginTop: '8px' }}>
                <input
                  type="range"
                  min="10000"
                  max="10000000"
                  step="10000"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            {/* Interest Rate */}
            <div className="field" style={{ marginBottom: '30px' }}>
              <label style={{ fontSize: "1.2rem" }}>Interest Rate (% per annum)</label>
              <input
                type="number"
                value={interestRate}
                step="0.1"
                onChange={(e) => setInterestRate(Number(e.target.value))}
                placeholder="Enter interest rate"
              />
              <div className="ui fluid slider" style={{ marginTop: '8px' }}>
                <input
                  type="range"
                  min="1"
                  max="20"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            {/* Tenure */}
            <div className="field" style={{ marginBottom: '30px' }}>
              <label style={{ fontSize: "1.2rem" }}>Tenure ({tenureType === 'months' ? 'Months' : 'Years'})</label>
              <div className="ui right labeled input">
                <input
                  type="number"
                  value={tenureType === 'months' ? tenure : tenure / 12}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    if (!isNaN(value)) {
                      setTenure(tenureType === 'months' ? value : value * 12);
                    }
                  }}
                  placeholder={`Enter tenure in ${tenureType}`}
                />
                <button
                  type="button"
                  className="ui label"
                  style={{ borderRadius: '0', backgroundColor: tenureType === 'years' ? '#cbd3da' : '#ededed' }}
                  onClick={() =>
                    setTenureType('years')
                  }
                >
                  Years
                </button>
                <button
                  type="button"
                  className="ui label"
                  style={{ borderRadius: '0', backgroundColor: tenureType === 'months' ? '#cbd3da' : '#ededed' }}
                  onClick={() =>
                    setTenureType('months')
                  }
                >
                  Months
                </button>
              </div>
              <div className="ui fluid slider" style={{ marginTop: '8px' }}>
                <input
                  type="range"
                  min={tenureType === 'months' ? 6 : 0.5}
                  max={tenureType === 'months' ? 360 : 30}
                  step={tenureType === 'months' ? 6 : 0.5}
                  value={tenureType === 'months' ? tenure : tenure / 12}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    setTenure(tenureType === 'months' ? value : value * 12);
                  }}
                  style={{ width: '100%' }}
                />
              </div>
            </div>
          </form>

          {emi && (
            <div className="ui message teal" style={{ marginTop: '20px' }}>
              <h4 className="ui header">Results</h4>
              <p><strong>Monthly EMI:</strong> ₹{emi}</p>
              <p><strong>Total Interest:</strong> ₹{totalInterest}</p>
              <p><strong>Total Payment:</strong> ₹{totalPayment}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default EMICalculator;
