import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AppBar } from "../components/AppBar";
import { BACKEND_URL } from "../config";

export const Account = () => {
  const [accountDetails, setAccountDetails] = useState<any>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [isOrg, setIsOrg] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userType = localStorage.getItem('userType');
    const token = localStorage.getItem('token');

    if (!token) {
      navigate("/signin");
      return;
    }

    const fetchAccountDetails = async () => {
      try {
        let response;
        if (userType === 'org') {
          setIsOrg(true);
          response = await axios.get(`${BACKEND_URL}/org/details`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        } else {
          response = await axios.get(`${BACKEND_URL}/user/details`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        }
        const accountData = response.data;
        setAccountDetails(accountData);
        
        // Fetch the balance from the Stellar network
        const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://horizon-testnet.stellar.org/accounts/${accountData.walletAddress}`,
        headers: { 
            'Accept': 'application/json'
        }
        };

        axios.request(config)
        .then((response) => {
            setBalance(response.data.balances[0].balance);
        })
        .catch((error) => {
        console.log(error);
        });

      } catch (error) {
        console.error("Failed to fetch account details", error);
        // navigate("/signin");
      }
    };

    fetchAccountDetails();
  }, [navigate]);

  if (!accountDetails) {
    return (
      <div>
        <AppBar />
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <AppBar />
      <div className="p-5">
        <h1 className="text-2xl font-bold">Account Details</h1>
        <p>Name: {accountDetails.name}</p>
        <p>Email: {accountDetails.email}</p>
        <p>Wallet Address: {accountDetails.walletAddress}</p>
        <p>Balance: {balance !== null ? `${balance} XLM` : "Loading..."}</p>
        {isOrg && <p>Total Donations: {accountDetails.totalDonation}</p>}
      </div>
    </div>
  );
};
