"use client";
import PopupInfo from '@/components/popupinfo';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
//import { PeraWalletConnect } from "@perawallet/connect";
//import * as algosdk from 'algosdk'
import _fetch from 'isomorphic-fetch';
import dotenv from 'dotenv';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import Autocomplete from "react-google-autocomplete";
const GOOGLE_API_KEY='AIzaSyCdgb63drAUPidFDZKNQnxix_ZQqwpfaxc';
const PROPERTY_API_KEY='f3f35d71a871fe8a775387875e11f8f340f4b77698c1933609eff43e959271c2';

const axios = require('axios');
const apiUrl = 'https://api.propmix.io/pubrec/assessor/v1/GetPropertyDetails';

const NFTcontract="0x006c4237E2233fc5b3793aD9E200076C9Cf99a0E";
const myabi=[
	{
	  "inputs": [],
	  "stateMutability": "nonpayable",
	  "type": "constructor"
	},
	{
	  "inputs": [
		{
		  "internalType": "address",
		  "name": "owner",
		  "type": "address"
		}
	  ],
	  "name": "OwnableInvalidOwner",
	  "type": "error"
	},
	{
	  "inputs": [
		{
		  "internalType": "address",
		  "name": "account",
		  "type": "address"
		}
	  ],
	  "name": "OwnableUnauthorizedAccount",
	  "type": "error"
	},
	{
	  "anonymous": false,
	  "inputs": [
		{
		  "indexed": true,
		  "internalType": "address",
		  "name": "previousOwner",
		  "type": "address"
		},
		{
		  "indexed": true,
		  "internalType": "address",
		  "name": "newOwner",
		  "type": "address"
		}
	  ],
	  "name": "OwnershipTransferred",
	  "type": "event"
	},
	{
	  "inputs": [
		{
		  "internalType": "address",
		  "name": "",
		  "type": "address"
		},
		{
		  "internalType": "address",
		  "name": "",
		  "type": "address"
		},
		{
		  "internalType": "uint256",
		  "name": "",
		  "type": "uint256"
		}
	  ],
	  "name": "bonusInfo",
	  "outputs": [
		{
		  "internalType": "address",
		  "name": "Sender",
		  "type": "address"
		},
		{
		  "internalType": "address",
		  "name": "Receiver",
		  "type": "address"
		},
		{
		  "internalType": "uint256",
		  "name": "bonusAmount",
		  "type": "uint256"
		},
		{
		  "internalType": "uint256",
		  "name": "startDate",
		  "type": "uint256"
		},
		{
		  "internalType": "uint256",
		  "name": "sellByDate",
		  "type": "uint256"
		},
		{
		  "internalType": "bool",
		  "name": "propertySold",
		  "type": "bool"
		},
		{
		  "internalType": "bool",
		  "name": "haveExpectedSalesPrice",
		  "type": "bool"
		},
		{
		  "internalType": "uint256",
		  "name": "expectedSalesPrice",
		  "type": "uint256"
		},
		{
		  "internalType": "bool",
		  "name": "meetSalesCondition",
		  "type": "bool"
		},
		{
		  "internalType": "bool",
		  "name": "postDeadlineCheck",
		  "type": "bool"
		}
	  ],
	  "stateMutability": "view",
	  "type": "function"
	},
	{
	  "inputs": [
		{
		  "internalType": "address",
		  "name": "Receiver",
		  "type": "address"
		},
		{
		  "internalType": "uint256",
		  "name": "propertyNumber",
		  "type": "uint256"
		},
		{
		  "internalType": "uint256",
		  "name": "startDateInDays",
		  "type": "uint256"
		},
		{
		  "internalType": "uint256",
		  "name": "sellByDateInDays",
		  "type": "uint256"
		},
		{
		  "internalType": "bool",
		  "name": "haveExpectedSalesPrice",
		  "type": "bool"
		},
		{
		  "internalType": "uint256",
		  "name": "expectedSalesPrice",
		  "type": "uint256"
		}
	  ],
	  "name": "createSenderFund",
	  "outputs": [],
	  "stateMutability": "payable",
	  "type": "function"
	},
	{
	  "inputs": [],
	  "name": "owner",
	  "outputs": [
		{
		  "internalType": "address",
		  "name": "",
		  "type": "address"
		}
	  ],
	  "stateMutability": "view",
	  "type": "function"
	},
	{
	  "inputs": [],
	  "name": "renounceOwnership",
	  "outputs": [],
	  "stateMutability": "nonpayable",
	  "type": "function"
	},
	{
	  "inputs": [
		{
		  "internalType": "address",
		  "name": "newOwner",
		  "type": "address"
		}
	  ],
	  "name": "transferOwnership",
	  "outputs": [],
	  "stateMutability": "nonpayable",
	  "type": "function"
	},
	{
	  "inputs": [
		{
		  "internalType": "address",
		  "name": "sender",
		  "type": "address"
		},
		{
		  "internalType": "address",
		  "name": "receiver",
		  "type": "address"
		},
		{
		  "internalType": "uint256",
		  "name": "propertyNumber",
		  "type": "uint256"
		},
		{
		  "internalType": "bool",
		  "name": "propertySold",
		  "type": "bool"
		},
		{
		  "internalType": "bool",
		  "name": "meetSalesCondition",
		  "type": "bool"
		},
		{
		  "internalType": "bool",
		  "name": "postDeadlineCheck",
		  "type": "bool"
		}
	  ],
	  "name": "updateBonusInfo",
	  "outputs": [],
	  "stateMutability": "nonpayable",
	  "type": "function"
	},
	{
	  "inputs": [
		{
		  "internalType": "address",
		  "name": "Receiver",
		  "type": "address"
		},
		{
		  "internalType": "uint256",
		  "name": "propertyNumber",
		  "type": "uint256"
		}
	  ],
	  "name": "withdrawFundsReceiver",
	  "outputs": [],
	  "stateMutability": "nonpayable",
	  "type": "function"
	},
	{
	  "inputs": [
		{
		  "internalType": "address",
		  "name": "Receiver",
		  "type": "address"
		},
		{
		  "internalType": "uint256",
		  "name": "propertyNumber",
		  "type": "uint256"
		}
	  ],
	  "name": "withdrawFundsSender",
	  "outputs": [],
	  "stateMutability": "nonpayable",
	  "type": "function"
	},
	{
	  "stateMutability": "payable",
	  "type": "receive"
	}
  ];

const {ethers} = require('ethers');
var provider;
var MyContract;
var MyContractwSigner;



export default function Home() {
	const [showBalloon,setShowBalloon] = useState(false);
	const [balloonText,setBalloonText] = useState("");
	const [buttonNewContract,setbuttonNewContract] = useState(true);
	const [buttonExistingContract,setbuttonExistingContract] = useState(true);
  	const [accountAddress, setAccountAddress] = useState(null);
  	const isConnectedToPeraWallet = !!accountAddress;
  	const router = useRouter();
	const [myaddress,setMyaddress] = useState('');
	const [streetaddress, setStreetaddress]=useState('');
	const [zipcode, setZipcode]=useState(0);

	useEffect(() => {
		// Reconnect to the session when the component is mounted
		
	}, []);

	const getPropertyDetails = async(
		accessToken, 
		streetAddress, 
		postalCode, 
		orderId) => {
			  const headers = {
				  'Access-Token': accessToken,
				};
				
				// Define query parameters
				const params = {
				  OrderId: orderId,
				  StreetAddress: streetAddress,
				  PostalCode: postalCode,
				};
				
				// Make the API call using Axios
				axios
				  .get(apiUrl, { headers, params })
				  .then((response) => {
					// Handle the API response
					console.log('API Response:', response.data);
				  })
				  .catch((error) => {
					// Handle errors
					console.error('Error calling API:', error.message);
				  });
	  }
	  

	const disconnect = async () => {
		//peraWallet.disconnect();
		setAccountAddress(null);
	}

  	const login = async () => {
		//Do we need to log in here?
	}

	async function callContract(APN) {
		//Here we need to change to ethereum calls
		/*const algodToken = '';
		const algodServer = 'https://testnet-api.algonode.cloud';
		const algodPort = undefined;
		const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);
	
		const suggestedParams = await algodClient.getTransactionParams().do();
		  console.log('suggestedParams:', suggestedParams);
	
		const contract = new algosdk.ABIContract(myabi);
		const atc = new algosdk.AtomicTransactionComposer();
	
		atc.addMethodCall({
			appID: 469360340,
			method: algosdk.getMethodByName(contract.methods, 'readFundsWithdrawnStatus'),
			sender: account,
			suggestedParams,
			signer: async (unsignedTxns) => {
				const txnGroups = unsignedTxns.map((t) => ({txn: t, signers: [t.from]}));
				return await peraWallet.signTransaction([txnGroups]);
			},
			methodArgs: [APN],
			boxes: [
				{
					appIndex: 469360340,
					name: new Uint8Array(Buffer.from(APN))
				}
			],
		});*/
		provider = new ethers.BrowserProvider(window.ethereum);
      	const signer = await provider.getSigner();
      	console.log(signer.address);
      

      	MyContract = new ethers.Contract(NFTcontract, myabi, provider);

      	MyContractwSigner = await MyContract.connect(signer);
      	

	
		try {
			//to chanhe to contract call
			//const results = await MyContract.
			//const results = await atc.execute(algodClient, 3);
			const active = results.methodResults[0].returnValue
			if (!active) {
				setbuttonExistingContract(false);
				setbuttonNewContract(true);
			}
			else {
				setBalloonText('Contract is no longer active');
				setShowBalloon(true);
			}
		} catch (e) {
			console.log(e);
			setbuttonNewContract(false);
			setbuttonExistingContract(true);
		}
	}

	const handleClickBalloon = () => {
		setBalloonText('Check the address of the given APN. If there is no active contract on the given APN, you can create a new contract. If there is an active contract, you can check the details of the existing contract.');
		setShowBalloon(true);
	}

	const handleCloseBalloon = () => {
		setShowBalloon(false);
	};

	async function checkAPN(APN) {

		/*peraWallet
		.reconnectSession()
		.then((accounts) => {
			if (peraWallet.isConnected) {
				callContract(APN, accounts[0]).then((res) => {
			});
			}
			else {
				login();
			}
		})
		.catch((e) => console.log(e));*/
		provider = new ethers.BrowserProvider(window.ethereum);
      	const signer = await provider.getSigner();
      	console.log(signer.address);
      

      	MyContract = new ethers.Contract(NFTcontract, myabi, provider);

      	MyContractwSigner = await MyContract.connect(signer);

		

	}

	const handleExistingContract = async() => {
		var data = document.getElementById("myAPNInput").value;
		const data2 = document.getElementById("addresscheck").value;
		router.push(`/existingContract?SelAPN=${data}&Address=${data2}`);
	};

	const handleNewContract = async() => {
		var data = document.getElementById("myAPNInput").value;
		const data2 = document.getElementById("addresscheck").value;
		router.push(`/newContract?SelAPN=${data}&Address=${data2}`);
	};
	
	const handleSelect = async(place) => {
		console.log(place);
		setStreetaddress(place['address_components'][1]['long_name']);
		setZipcode(place['address_components'][7]['long_name']);
	}

	const checkaddress = async() => {
		// we need to change this one where the address is put in, with the Google API
		//console.log('Google API = '+GOOGLE_API_KEY);
		console.log('street = '+streetaddress);
		console.log('zip = '+zipcode);
		var myorder = streetaddress+'_'+zipcode;
		//var myAPN = await getPropertyDetails(PROPERTY_API_KEY,streetaddress,zipcode,myorder);
		//console.log(myAPN);

		/*
		var myAPN = document.getElementById("myAPNInput").value;
		dotenv.config()
		const API_KEY = process.env.NEXT_PUBLIC_API_KEY
		if (myAPN != "") {
			const url = `https://api.rentcast.io/v1/properties/${encodeURIComponent(myAPN)}`;

			try {
				const response = await _fetch(url, {
				method: 'GET',
				headers: {
					accept: 'application/json',
					'X-Api-Key': API_KEY,
				},
			});
		
			if (response.ok) {
				const json = await response.json();
				const myText = document.getElementById("addresscheck");
				myText.value = json.addressLine1;
				console.log(json)
				const lastSaleDate = json.lastSaleDate;
				const lastSalePrice = json.lastSalePrice;
				console.log(lastSaleDate);
				console.log(lastSalePrice)
				localStorage.setItem("lastSaleDate", lastSaleDate);
				localStorage.setItem("lastSalePrice", lastSalePrice);
				checkAPN(myAPN);
			} else {
				setBalloonText('No property found for the given ID');
				setShowBalloon(true);
				console.log('No property found for the given ID');
			}
			} catch (error) {
				console.log('Error fetching property information: ' + error.message);
			}
		}
		else {
			setBalloonText('Please enter an APN');
			setShowBalloon(true);
		}*/
		
	} 

	return (
		<section className='contract-wrapper'>
		  <div className='mb-2 pb-20 container flex space-between flex-end'>
			<div className='flex-col flex-start pt-4 pb-0 contract-left'>
			  
			  <section className="flex mb-8">
			  <Autocomplete
                
                apiKey={GOOGLE_API_KEY}
                style={{
                    width: "50%",
                    marginBottom: 8,
                    paddingInline: 8,
                    paddingBlock: 4,
                    borderRadius: 8,
                    zIndex: 100,
                }}
                options={{
                    types: [],
                    componentRestrictions: { country: "us" },
                }}
                onPlaceSelected={(place) => {
                    handleSelect(place);
                }}
            />
				<input
				  type="text"
				  id="myAPNInput"
				  className="w-60 bg-default-bg rounded px-3 py-2 focus:outline-offset-0 outline-sky-200 m-2 border APN_input"
				  placeholder="Enter APN"
				  required
				/>
				<button
				  type='button'
				  className='my-2 blue_btn about px-4 py-2'
				  onClick={checkaddress}
				>
				  Check Address
				</button>
				<button
				  type="button"
				  onClick={handleClickBalloon}
				  className="info_btn m-2 about hover:bg-[#000000]/90 focus:outline-none focus:ring-[#000000]/50 inline-flex items-center hover:text-[#ffffff] dark:focus:ring-[#000000]/55"
				>
				  <FontAwesomeIcon icon={faCircleInfo} style={{ color: "#ffffff", fontSize: '12px' }} className='m-2 py-0' />
				</button>
			  </section>
	  
			  <section className="flex-start mb-6 mt-0 w-120">
				<textarea
				  id="addresscheck"
				  className="resize-none m-2 sm:w-96 h-15 px-4 py-4 text-white bg-gray-800 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center"
				  disabled
				  placeholder="Address Will Display Here"
				></textarea>
			  </section>
			  <section className="flex-start">
				<div className="w-full sm:w-1/2 text-center mr-10 m-2">
				  <button
					className={`hover:bg-gray-200 text-white font-semibold py-3 px-6 rounded-lg mb-4  border border-sky-200 ${buttonNewContract ? 'bg-white cursor-not-allowed' : 'bg-white'}`}
					onClick={handleNewContract}
					disabled={buttonNewContract}
				  >
					<img src="/assets/images/newfile.png" alt="New File Image" className="h-12 w-12" />
				  </button>
				  <p className="text-default-text">New <span><p>Contract</p></span></p>
				</div>
				<div className="w-full sm:w-1/2 text-center m-2">
				  <button
					className={`hover:bg-gray-200 text-white font-semibold py-3 px-6 rounded-lg mb-4  border border-sky-200 ${buttonExistingContract ? 'bg-white cursor-not-allowed' : 'bg-default-bg'}`}
					onClick={handleExistingContract}
					disabled={buttonExistingContract}
				  >
					<img src="/assets/images/existingfile.png" alt="Existing File Image" className="h-12 w-12" />
				  </button>
				  <p className="text-default-text">Existing <span><p>Contract</p></span></p>
				</div>
			  </section>
			  <footer className="flex justify-start pt-5">
				<a href="https://www.smartcrow.info" className="m-2 font-semibold text-default-bt-text hover:underline">
				  About Us
				</a>
			  </footer>
			  {showBalloon && <PopupInfo text={balloonText} closeModal={handleCloseBalloon} isOpen={showBalloon} />}
			</div>
	  
			
	  
		  </div>
		</section>
	  );	  
}
