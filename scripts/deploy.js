async function main() {
    const [deployer] = await ethers.getSigners();
  
    console.log("Deploying contracts with the account:", deployer.address);
  
    console.log("Account balance:", (await deployer.getBalance()).toString());
  
    const Marketplace = await ethers.getContractFactory("OdysseyMarketplace");
    // const marketplace = await Marketplace.deploy("0x0000000000000000000000000000000000000101", "0xBaaF78Fc0de9eEc3e6c4B46aF8d441Cc14c13A05", "0xb210cA5581D50FDD9a364D2D807a73B6c3A2348A", "0xBaaF78Fc0de9eEc3e6c4B46aF8d441Cc14c13A05", 200);

    const marketplace = await Marketplace.deploy("0xc778417E063141139Fce010982780140Aa0cD5Ab", "0xB8CEfA012D06adC12fAd07174acC87B94ABb2A1D", "0xdC715F07dEBcfCB49de9e3d285EA94C12A585632", "0xB8CEfA012D06adC12fAd07174acC87B94ABb2A1D", 200);
  
    //0x07BC6fc6a65469BAd3d79c723D7c7D4D90216FE6
    console.log("marketplace address:", marketplace.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });

    // "0xc778417E063141139Fce010982780140Aa0cD5Ab" "0xB8CEfA012D06adC12fAd07174acC87B94ABb2A1D" "0xdC715F07dEBcfCB49de9e3d285EA94C12A585632" "0xB8CEfA012D06adC12fAd07174acC87B94ABb2A1D" 200