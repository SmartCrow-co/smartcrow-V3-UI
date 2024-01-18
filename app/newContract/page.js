"use client";
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Popup from '@/components/popup';
import PopupSuccess from '@/components/popupsuccess';
import PopupInfo from '@/components/popupinfo';
//import { PeraWalletConnect } from "@perawallet/connect";
//import * as algosdk from 'algosdk'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';

const NFTcontract="0x5771C86DA1f1cC114Cc2831a37182De41F1Fb972";
const myabi = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"OwnableInvalidOwner","type":"error"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"OwnableUnauthorizedAccount","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"string","name":"","type":"string"}],"name":"bonusInfo","outputs":[{"internalType":"address","name":"Sender","type":"address"},{"internalType":"address","name":"Receiver","type":"address"},{"internalType":"uint256","name":"bonusAmount","type":"uint256"},{"internalType":"uint256","name":"startDate","type":"uint256"},{"internalType":"uint256","name":"sellByDate","type":"uint256"},{"internalType":"bool","name":"atOrAbove","type":"bool"},{"internalType":"bool","name":"atOrBelow","type":"bool"},{"internalType":"uint256","name":"atPrice","type":"uint256"},{"internalType":"bool","name":"meetSalesCondition","type":"bool"},{"internalType":"bool","name":"postDeadlineCheck","type":"bool"},{"internalType":"bool","name":"fundsWithdrawn","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"Receiver","type":"address"},{"internalType":"string","name":"propertyNumber","type":"string"},{"internalType":"uint256","name":"startDateInUnixSeconds","type":"uint256"},{"internalType":"uint256","name":"sellByDateInUnixSeconds","type":"uint256"},{"internalType":"bool","name":"atOrAbove","type":"bool"},{"internalType":"bool","name":"atOrBelow","type":"bool"},{"internalType":"uint256","name":"atPrice","type":"uint256"}],"name":"createSenderFund","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"receiver","type":"address"},{"internalType":"string","name":"propertyNumber","type":"string"},{"internalType":"bool","name":"meetSalesCondition","type":"bool"},{"internalType":"bool","name":"postDeadlineCheck","type":"bool"}],"name":"updateBonusInfo","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"Receiver","type":"address"},{"internalType":"string","name":"propertyNumber","type":"string"}],"name":"withdrawFundsReceiver","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"Receiver","type":"address"},{"internalType":"string","name":"propertyNumber","type":"string"}],"name":"withdrawFundsSender","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}];
const {ethers} = require('ethers');
var provider;
var MyContract;
var MyContractwSigner;


const MyForm = () => {
  const today = new Date().toISOString().substring(0, 10); // Get today's date in yyyy-mm-dd format
	const [verificationfailed, setVerified] = useState(true);
	const [showPopup, setShowPopup] = useState(false);
	const [showPopupSuccess, setShowPopupSuccess] = useState(false);
  const [popupHeader, setPopupHeader] = useState("");
	const [popupHeaderSuccess, setPopupHeaderSuccess] = useState("");
  const [popupText, setPopupText] = useState("");
	const [showBalloon,setShowBalloon] = useState(false);
	const [balloonText,setBalloonText] = useState("");
	const [accountAddress, setAccountAddress] = useState(null);
  const [isForSale, setIsForSale] = useState(true);
  const [PriceCondition, setPriceCondition] = useState(true);
  const isConnectedToPeraWallet = !!accountAddress;

	useEffect(() => {
		// Reconnect to the session when the component is mounted
		
	  }, []);

	const searchParams = useSearchParams()
  const SelAPN = searchParams.get('SelAPN');
	const Address = searchParams.get('Address')+'\n APN : '&searchParams.get('fetchedAPN');
  const SenderAddress = searchParams.get('Sender');
  const ReceiverAddress = searchParams.get('Receiver');
  const router = useRouter();

	async function callBonus(account) {
		var APN = document.getElementById("parcelid").value;
		var amount = document.getElementById("bonusamount").value;
    var seller = document.getElementById("senderwallet").value;
		var realtor = document.getElementById("receiverwallet").value;
		var Sellby = new Date(document.getElementById("sellbydate").value);
		var selltimestamp = Math.floor(Sellby.getTime()/1000);
		var Startby = new Date(document.getElementById("startdate").value);
		var startdatetimestamp = Math.floor(Startby.getTime()/1000);
    var salesPrice = document.getElementById("salesprice").value;
    var boolabove = PriceCondition;
    var boolbelow = !PriceCondition;


    salesPrice /= 1e6

    provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    console.log(signer.address);
      

    MyContract = new ethers.Contract(NFTcontract, myabi, signer);
    console.log(MyContract);
    //MyContractwSigner = await MyContract.connect(signer);

    
    
    
		const results = await MyContract.createSenderFund(realtor,APN,startdatetimestamp,selltimestamp,boolabove,boolbelow,salesPrice);
		console.log(`Contract created ` + results);
		setPopupHeaderSuccess('Contract Initiated!');
		setShowPopupSuccess(true);
	}


	
	const createbonusfunc = async () => {
    /*
		peraWallet
		.reconnectSession()
		.then((accounts) => {
			if (peraWallet.isConnected) {
				callBonus(accounts[0])
			}
			else {
				login();
			}
		})
		.catch((e) => console.log(e));*/
    await callBonus();
	}

	const login = async () => {
		
	}

	const disconnect = async () => {
		
		setAccountAddress(null);
	}

	const handleClosePopup = () => {
        setShowPopup(false);
      };

	  const handleClosePopupSuccess = () => {
        setShowPopupSuccess(false);
		    router.push('/checkContract');
    };

	  const handleClickBalloon = () => {
		setBalloonText('The amount entered is in Algos. For a conversion to USD, please visit https://www.coinbase.com/converter/algo/usd');
		setShowBalloon(true);
	  }

	  const handleClickBalloon2 = () => {
		setBalloonText('This is the start date of the contract.');
		setShowBalloon(true);
	  }

	  const handleClickBalloon3 = () => {
		setBalloonText('This is the end date of the contract. The real property grant deed must be recorded by this date.');
		setShowBalloon(true);
	  }

	  const handleClickBalloon4 = () => {
		setBalloonText('This is the sender wallet address. This wallet address will fund the contract via PeraWallet.');
		setShowBalloon(true);
	  }

	  const handleClickBalloon5 = () => {
		setBalloonText('This is the receiver wallet address. If contract terms are met, funds will be sent to the receiver wallet address.');
		setShowBalloon(true);
	  }

    const handleClickBalloon6 = () => {
      setBalloonText('This is the sales price of the conract. Add the anticipated, future, greater than or equal to sales price of the real estate/home.');
      setShowBalloon(true);
      }

	  const handleCloseBalloon = () => {
        setShowBalloon(false);
      };

	  const handleChange = async() => {
      console.log('Verifying input');
      const verAmount= document.getElementById("bonusamount").value;
      const verStartdate= document.getElementById("startdate").value;
      const verSellbydate= document.getElementById("sellbydate").value;
      const verSeller = document.getElementById("senderwallet").value;
      const verRealtor = document.getElementById("receiverwallet").value;
      const salesPrice = document.getElementById("salesprice").value;

      if (isForSale) {
        if (verAmount==0 || verStartdate=="" || verSellbydate=="" ||verSeller=="" || verRealtor=="" || salesPrice=="" || verSeller==verRealtor) {
          setVerified(true);
        }
        else {
          setVerified(false);
        }
      }
      else {
        if (verAmount==0 || verStartdate=="" || verSellbydate=="" ||verSeller=="" || verRealtor=="" || verSeller==verRealtor) {
          setVerified(true);
        }
        else {
          setVerified(false);
        }
      }
	  }

    return (
      <div className="min-h-screen">
        <nav className="flex justify-between items-center">
          <p className="text-black font-bold text-sm md:text-lg m-2">New Contract</p>
        </nav>
        <div className="container mx-auto pb-3">
          <div className="flex flex-col gap-0.5">
            
            <section className="flex mb-8">
              <input
                type="text"
                id="parcelid"
                className="m-2 bg-default-bg rounded px-3 py-2 focus:outline-offset-0 outline-sky-200 m-2 border APN_input max-w-screen-sm flex-grow"
                defaultValue={SelAPN}
                onChange={handleChange}
                placeholder="APN"
              />
              <button 
                type="button" 
                onClick={handleClickBalloon}
                className="info_btn m-2 about hover:bg-[#000000]/90 focus:outline-none focus:ring-[#000000]/50 inline-flex items-center hover:text-[#ffffff] dark:focus:ring-[#000000]/55"
              >
                <FontAwesomeIcon icon={faCircleInfo} style={{ color: "#ffffff", fontSize: '12px' }} className='m-2 py-0' />
              </button>
            </section>
            
            <section className="flex-start m-2 mt-0">
              <textarea
                id="addresscheck"
                className="ml-0 resize-none flex-grow max-w-screen-m h-15 px-4 py-4 text-white bg-gray-800 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center"
                disabled
                defaultValue={Address}
              ></textarea>
            </section>
    
            {/* Amount USDC */}
            <label htmlFor="bonusamount" className="font-bold mr-4 m-2 text-black">
              Amount (USDC)
            </label>
            <section className="flex mb-8">
              <input
                type="number"
                placeholder='0'
                inputMode='numeric'
                id="bonusamount"
                min="0"
                className="w-60 bg-default-bg rounded px-3 py-2 focus:outline-offset-0 outline-sky-200 m-2 border APN_input max-w-screen-sm flex-grow"
                onChange={handleChange}
              />
              <button 
                type="button" 
                onClick={handleClickBalloon}
                className="info_btn m-2 about hover:bg-[#000000]/90 focus:outline-none focus:ring-[#000000]/50 inline-flex items-center hover:text-[#ffffff] dark:focus:ring-[#000000]/55"
              >
                <FontAwesomeIcon icon={faCircleInfo} style={{ color: "#ffffff", fontSize: '12px' }} className='m-2 py-0' />
              </button>
            </section>
    
            {/* Dates */}
            <div className='container flex flex-row'>
              <div className='left-date'>
                <label htmlFor="bonusamount" className="font-bold m-2 text-black">
                  Start Date
                </label>
                <div className="flex items-center flex-row p-2">
                  <section className="flex mb-8">
                    <input
                      type="date"
                      id="startdate"
                      className="max-w-screen-m flex-grow py-2 px-3 mt-1 w-60 bg-default-bg rounded focus:outline-offset-0 outline-sky-200 border APN_input"
                      defaultValue={today}
                      onChange={handleChange}
                    />
                    <button 
                      onClick={handleClickBalloon2}
                      className="info_btn m-2 about hover:bg-[#000000]/90 focus:outline-none focus:ring-[#000000]/50 inline-flex items-center hover:text-[#ffffff] dark:focus:ring-[#000000]/55"
                    >
                      <FontAwesomeIcon icon={faCircleInfo} style={{ color: "#ffffff", fontSize: '12px' }} className='m-2 py-0' />
                    </button>
                  </section>
                </div>
              </div>
    
              <div className='right-date ml-12'>
                <label htmlFor="bonusamount" className="font-bold m-2 text-black">
                  Sold By
                </label>
                <div className="flex items-center flex-row p-2">
                  <section className="flex mb-8">
                    <input
                      type="date"
                      id="sellbydate"
                      className="max-w-screen-m flex-grow py-2 px-3 mt-1 w-60 bg-default-bg rounded focus:outline-offset-0 outline-sky-200 border APN_input"
                      defaultValue={today}
                      onChange={handleChange}
                    />
                    <button 
                      onClick={handleClickBalloon3}
                      className="info_btn m-2 about hover:bg-[#000000]/90 focus:outline-none focus:ring-[#000000]/50 inline-flex items-center hover:text-[#ffffff] dark:focus:ring-[#000000]/55"
                    >
                      <FontAwesomeIcon icon={faCircleInfo} style={{ color: "#ffffff", fontSize: '12px' }} className='m-2 py-0' />
                    </button>
                  </section>
                </div>
              </div>
            </div>
    
            {/* Add Sales Price */}
            <label htmlFor="bonusamount" className="font-bold m-2 text-black">Add Sales Price: </label>
            <div className="flex items-center flex-row p-2">
              <div className="flex items-center">
                <label className="mr-10 m-2">
                  <input
                    type="radio"
                    id="yes"
                    checked={isForSale}
                    onChange={() => {
                      setIsForSale(true);
                      handleChange();
                      console.log("handle change2");
                    }}
                    className="mr-1"
                  />
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    id="no"
                    checked={!isForSale}
                    onChange={() => {
                      setIsForSale(false);
                      document.getElementById("salesprice").value = 0;
                      handleChange();
                      console.log("handle change");
                    }}
                    className="mr-1"
                  />
                  No
                </label>
              </div>
            </div>
            {/* sales condition*/}
            <label htmlFor="bonuscondition" className="font-bold m-2 text-black">Sales price condition: </label>
            <div className="flex items-center flex-row p-2">
              <div className="flex items-center">
                <label className="mr-10 m-2">
                  <input
                    type="radio"
                    id="priceabove"
                    checked={PriceCondition}
                    onChange={() => {
                      setPriceCondition(true);
                      handleChange();
                      console.log("handle change price condition 2");
                    }}
                    className="mr-1"
                  />
                  Equal or Above
                </label>
                <label>
                  <input
                    type="radio"
                    id="no"
                    checked={!PriceCondition}
                    onChange={() => {
                      setPriceCondition(false);
                      //document.getElementById("salesprice").value = 0;
                      handleChange();
                      console.log("handle change price condition");
                    }}
                    className="mr-1"
                  />
                  Equal or Below
                </label>
              </div>
            </div>
            {/* Sales Price */}
            <label htmlFor="bonusamount" className="font-bold mt-4 m-2 text-black">
              Sales Price :
            </label>
            <section className="flex mb-8">
              <input
                type="number"
                inputMode='numeric'
                id="salesprice"
                min="0"
                className="w-60 bg-default-bg rounded px-3 py-2 focus:outline-offset-0 outline-sky-200 m-2 border APN_input max-w-screen-sm flex-grow"
                onChange={handleChange}
                disabled={!isForSale}
              />
              <button 
                type="button" 
                onClick={handleClickBalloon6}
                className="info_btn m-2 about hover:bg-[#000000]/90 focus:outline-none focus:ring-[#000000]/50 inline-flex items-center hover:text-[#ffffff] dark:focus:ring-[#000000]/55"
              >
                <FontAwesomeIcon icon={faCircleInfo} style={{ color: "#ffffff", fontSize: '12px' }} className='m-2 py-0' />
              </button>
            </section>
    
            {/* Sender Wallet */}
            <label htmlFor="senderwallet" className="font-bold mr-4 m-2 text-black">Sender Wallet</label>
            <section className="flex mb-8">
              <input
                type="text"
                id="senderwallet"
                defaultValue={SenderAddress}
                className="w-60 bg-default-bg rounded px-3 py-2 focus:outline-offset-0 outline-sky-200 m-2 border APN_input max-w-screen-sm flex-grow"
                onChange={handleChange}
              />
              <button 
                type="button" 
                onClick={handleClickBalloon4}
                className="info_btn m-2 about hover:bg-[#000000]/90 focus:outline-none focus:ring-[#000000]/50 inline-flex items-center hover:text-[#ffffff] dark:focus:ring-[#000000]/55"
              >
                <FontAwesomeIcon icon={faCircleInfo} style={{ color: "#ffffff", fontSize: '12px' }} className='m-2 py-0' />
              </button>
            </section>
    
            {/* Receiver Wallet */}
            <label htmlFor="receiverwallet" className="font-bold mr-4 m-2 text-black">Receiver Wallet</label>
            <section className="flex mb-8">
              <input
                type="text"
                id="receiverwallet"
                defaultValue={ReceiverAddress}
                className="w-60 bg-default-bg rounded px-3 py-2 focus:outline-offset-0 outline-sky-200 m-2 border APN_input max-w-screen-sm flex-grow"
                onChange={handleChange}
              />
              <button 
                type="button" 
                onClick={handleClickBalloon5}
                className="info_btn m-2 about hover:bg-[#000000]/90 focus:outline-none focus:ring-[#000000]/50 inline-flex items-center hover:text-[#ffffff] dark:focus:ring-[#000000]/55"
              >
                <FontAwesomeIcon icon={faCircleInfo} style={{ color: "#ffffff", fontSize: '12px' }} className='m-2 py-0' />
              </button>
            </section>
    
            <div className="p-6 flex items-center justify-center">
              <button 
                className={`create_blue_btn py-2 px-4 rounded ${
                  verificationfailed ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-default-bt text-default-bt-text hover:bg-gr-200 border border-default-border'
                }`} 
                disabled={verificationfailed} 
                onClick={createbonusfunc}
              >
                Create Contract
              </button>
            </div>
            <div className="p-6 flex items-center justify-center">
              <p className='text-xs text-red-700'>Once Create Contract button is pressed, all entered data is final and cannot be edited. Make sure all entered data is correct.</p>
            </div>
          </div>
        </div>
    
        {showPopup && (
          <Popup header={popupHeader} text={popupText} closeModal={handleClosePopup} isOpen={showPopup}/>
        )}
        {showPopupSuccess && (
          <PopupSuccess header={popupHeaderSuccess} text={""} closeModal={handleClosePopupSuccess} isOpen={showPopupSuccess}/>
        )}
        {showBalloon && (
          <PopupInfo text={balloonText} closeModal={handleCloseBalloon} isOpen={showBalloon}/>
        )}
      </div>
    );    
  };
  
  export default MyForm;