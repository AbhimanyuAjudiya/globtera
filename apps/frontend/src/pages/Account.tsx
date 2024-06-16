import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AppBar } from "../components/AppBar";
import { BACKEND_URL } from "../config";

export const Account = () => {
  const [accountDetails, setAccountDetails] = useState<any>(null);
  const [isOrg, setIsOrg] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userType = localStorage.getItem('userType');
    const token = localStorage.getItem('token');
    console.log(token);
    
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
        setAccountDetails(response.data);
      } catch (error) {
        console.error("Failed to fetch account details", error);
        navigate("/signin");
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
        {isOrg && <p>Total Donations: {accountDetails.totalDonation}</p>}
      </div>
    </div>
  );
};
