"use client";
import { TabsTrigger, TabsList, TabsContent, Tabs } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { SelectValue, SelectTrigger, SelectItem, SelectContent, Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { faker } from "@faker-js/faker";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


type CreditCardBrand = 'Visa' | 'Mastercard' | 'American Express' | 'Discover' | 'JCB' | 'Diners Club' | 'UnionPay';

interface CreditCardDetails {
  brand: CreditCardBrand;
  number: string;
  cvv: string;
  expMonth: string;
  expYear: string;
  cardHolderName: string;
}

const brands: CreditCardBrand[] = ['Visa', 'Mastercard', 'American Express', 'Discover', 'JCB', 'Diners Club', 'UnionPay'];

const getRandomElement = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const generateCardNumber = (brand: CreditCardBrand): string => {
  const prefix = {
    'Visa': '4',
    'Mastercard': '5',
    'American Express': '3',
    'Discover': '6',
    'JCB': '3',
    'Diners Club': '3',
    'UnionPay': '6',
  }[brand];
  let number = prefix + Array.from({ length: brand === 'American Express' ? 14 : 15 }, () => Math.floor(Math.random() * 10)).join('');

  return luhnCheck(number) ? number : generateCardNumber(brand);
};

const luhnCheck = (num: string): boolean => {
  let sum = 0;
  let shouldDouble = false;
  for (let i = num.length - 1; i >= 0; i--) {
    let digit = parseInt(num.charAt(i));
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
};

const generateCVV = (brand: CreditCardBrand): string => {
  const length = brand === 'American Express' ? 4 : 3;
  return faker.finance.creditCardCVV().slice(0, length);
};

const generateCreditCardDetails = (brand: string, cvv: string, expMonth: string, expYear: string, quantity: number): CreditCardDetails[] => {
  const results: CreditCardDetails[] = [];
  for (let i = 0; i < quantity; i++) {
    const selectedBrand = brand === 'random' ? getRandomElement(brands) : brand as CreditCardBrand;
    const cardNumber = generateCardNumber(selectedBrand);
    const cardCVV = cvv === 'random' ? generateCVV(selectedBrand) : cvv;
    const cardExpMonth = expMonth === 'random' ? String(Math.floor(Math.random() * 12) + 1).padStart(2, '0') : expMonth.padStart(2, '0');
    const cardExpYear = expYear === 'random' ? String(Math.floor(Math.random() * 11) + 2024) : expYear;
    const cardHolderName = faker.person.fullName();

    results.push({
      brand: selectedBrand,
      number: cardNumber,
      cvv: cardCVV,
      expMonth: cardExpMonth,
      expYear: cardExpYear,
      cardHolderName: cardHolderName,
    });
  }
  return results;
};

export function Component() {
  const [selectedCardBrand, setSelectedCardBrand] = useState<string>('random');
  const [selectedCVV, setSelectedCVV] = useState<string>('random');
  const [selectedExpMonth, setSelectedExpMonth] = useState<string>('random');
  const [selectedExpYear, setSelectedExpYear] = useState<string>('random');
  const [selectedQuantity, setSelectedQuantity] = useState<string>('1');
  const [generatedCards, setGeneratedCards] = useState<CreditCardDetails[]>([]);

  const handleCardBrandChange = (value: string) => {
    setSelectedCardBrand(value);
  };

  const handleCVVChange = (value: string) => {
    setSelectedCVV(value);
  };

  const handleExpMonthChange = (value: string) => {
    setSelectedExpMonth(value);
  };

  const handleExpYearChange = (value: string) => {
    setSelectedExpYear(value);
  };

  const handleQuantityChange = (value: string) => {
    setSelectedQuantity(value);
  };

  const handleGenerate = () => {
    const cards = generateCreditCardDetails(selectedCardBrand, selectedCVV, selectedExpMonth, selectedExpYear, parseInt(selectedQuantity));
    setGeneratedCards(cards);
  };
  //copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Copied to clipboard!', {
        autoClose: 800, // 3 seconds
      });
    }, (err) => {
      console.error('Could not copy text: ', err);
      toast.error('Failed to copy text.');
    });
  };
  return (
    <section key="1" className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-[#6a11cb] to-[#2575fc]">
      <div className="container mx-auto max-w-4xl px-4 md:px-6">
        <div className="space-y-4 text-center text-white">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Credit Card Generator</h1>
          <p className="text-gray-200 md:text-xl">
            Quickly generate valid test credit card numbers for various purposes such as testing, service sign-ups, and
            payment gateway trials.
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <Tabs className="w-full" defaultValue="simple">
            <TabsList className="grid grid-cols-2 gap-2">
              <TabsTrigger className="bg-white text-[#6a11cb] hover:bg-[#f0f0f0] focus:bg-[#f0f0f0]" value="simple">
                Simple Mode
              </TabsTrigger>
              <TabsTrigger className="bg-white text-[#6a11cb] hover:bg-[#f0f0f0] focus:bg-[#f0f0f0]" value="advanced">
                Advanced Mode
              </TabsTrigger>
            </TabsList>
            <TabsContent value="simple">
              <Card className="p-6 bg-white shadow-lg rounded-2xl">
                <form className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label className="text-[#6a11cb] font-medium" htmlFor="card-brand">
                        Card Brand
                      </Label>
                      <Select className="rounded-lg" defaultValue="random" id="card-brand" onValueChange={handleCardBrandChange}>
                        <SelectTrigger className="bg-[#f0f0f0] text-[#6a11cb] hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]">
                          <SelectValue placeholder="Random" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#f0f0f0] text-[#6a11cb] rounded-lg shadow-lg">
                          <SelectItem className="hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]" value="random">
                            Random
                          </SelectItem>
                          <SelectItem className="hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]" value="Visa">
                            Visa
                          </SelectItem>
                          <SelectItem className="hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]" value="Mastercard">
                            Mastercard
                          </SelectItem>
                          <SelectItem className="hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]" value="American Express">
                            American Express
                          </SelectItem>
                          <SelectItem className="hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]" value="Discover">
                            Discover
                          </SelectItem>
                          <SelectItem className="hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]" value="JCB">
                            JCB
                          </SelectItem>
                          <SelectItem className="hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]" value="Diners Club">
                            Diners Club
                          </SelectItem>
                          <SelectItem className="hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]" value="UnionPay">
                            UnionPay
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label className="text-[#6a11cb] font-medium" htmlFor="cvv">
                        CVV/CVV2
                      </Label>
                      <Select className="rounded-lg" defaultValue="random" id="cvv" onValueChange={handleCVVChange}>
                        <SelectTrigger className="bg-[#f0f0f0] text-[#6a11cb] hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]">
                          <SelectValue placeholder="Random" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#f0f0f0] text-[#6a11cb] rounded-lg shadow-lg">
                          <SelectItem className="hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]" value="random">
                            Random
                          </SelectItem>
                          <SelectItem className="hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]" value="123">
                            123
                          </SelectItem>
                          <SelectItem className="hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]" value="456">
                            456
                          </SelectItem>
                          <SelectItem className="hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]" value="789">
                            789
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label className="text-[#6a11cb] font-medium" htmlFor="exp-month">
                        Expiration Month
                      </Label>
                      <Select className="rounded-lg" defaultValue="random" id="exp-month" onValueChange={handleExpMonthChange}>
                        <SelectTrigger className="bg-[#f0f0f0] text-[#6a11cb] hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]">
                          <SelectValue placeholder="Random" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#f0f0f0] text-[#6a11cb] rounded-lg shadow-lg">
                          <SelectItem className="hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]" value="random">
                            Random
                          </SelectItem>
                          <SelectItem className="hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]" value="01">
                            01 - January
                          </SelectItem>
                          <SelectItem className="hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]" value="02">
                            02 - February
                          </SelectItem>
                          <SelectItem className="hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]" value="03">
                            03 - March
                          </SelectItem>
                          <SelectItem className="hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]" value="04">
                            04 - April
                          </SelectItem>
                          <SelectItem className="hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]" value="05">
                            05 - May
                          </SelectItem>
                          <SelectItem className="hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]" value="06">
                            06 - June
                          </SelectItem>
                          <SelectItem className="hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]" value="07">
                            07 - July
                          </SelectItem>
                          <SelectItem className="hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]" value="08">
                            08 - August
                          </SelectItem>
                          <SelectItem className="hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]" value="09">
                            09 - September
                          </SelectItem>
                          <SelectItem className="hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]" value="10">
                            10 - October
                          </SelectItem>
                          <SelectItem className="hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]" value="11">
                            11 - November
                          </SelectItem>
                          <SelectItem className="hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]" value="12">
                            12 - December
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label className="text-[#6a11cb] font-medium" htmlFor="exp-year">
                        Expiration Year
                      </Label>
                      <Select className="rounded-lg" defaultValue="random" id="exp-year" onValueChange={handleExpYearChange}>
                        <SelectTrigger className="bg-[#f0f0f0] text-[#6a11cb] hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]">
                          <SelectValue placeholder="Random" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#f0f0f0] text-[#6a11cb] rounded-lg shadow-lg">
                          <SelectItem className="hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]" value="random">
                            Random
                          </SelectItem>
                          <SelectItem className="hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]" value="2024">
                            2024
                          </SelectItem>
                          <SelectItem className="hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]" value="2025">
                            2025
                          </SelectItem>
                          <SelectItem className="hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]" value="2026">
                            2026
                          </SelectItem>
                          <SelectItem className="hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]" value="2027">
                            2027
                          </SelectItem>
                          <SelectItem className="hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]" value="2028">
                            2028
                          </SelectItem>
                          <SelectItem className="hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]" value="2029">
                            2029
                          </SelectItem>
                          <SelectItem className="hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]" value="2030">
                            2030
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-[#6a11cb] font-medium" htmlFor="quantity">
                      Quantity
                    </Label>
                    <Select className="rounded-lg" defaultValue="1" id="quantity" onValueChange={handleQuantityChange} >
                      <SelectTrigger className="bg-[#f0f0f0] text-[#6a11cb] hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]">
                        <SelectValue placeholder="1" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#f0f0f0] text-[#6a11cb] rounded-lg shadow-lg">
                        <SelectItem className="hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]" value="1">
                          1
                        </SelectItem>
                        <SelectItem className="hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]" value="2">
                          2
                        </SelectItem>
                        <SelectItem className="hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]" value="3">
                          3
                        </SelectItem>
                        <SelectItem className="hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]" value="4">
                          4
                        </SelectItem>
                        <SelectItem className="hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]" value="5">
                          5
                        </SelectItem>
                        <SelectItem className="hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]" value="6">
                          6
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    className="w-full bg-[#6a11cb] text-white hover:bg-[#2575fc] focus:bg-[#2575fc] shadow-lg"
                    type="button"
                    onClick={handleGenerate}
                  >
                    Generate Cards
                  </Button>
                </form>
              </Card>
              <div className="mt-8 space-y-4">
      <ToastContainer />
      {generatedCards.map((card, index) => (
        <div key={index} className="p-4 bg-white shadow-md rounded-md">
          <h2 className="text-xl font-semibold">{card.brand} Credit Card</h2>
          <div className="flex items-center">
            <p>Number: {card.number}</p>
            <button 
              onClick={() => copyToClipboard(card.number)} 
              className="ml-2 px-2 py-1 bg-blue-500 text-white rounded"
            >
              Copy
            </button>
          </div>
          <div className="flex items-center">
            <p>CVV: {card.cvv}</p>
            <button 
              onClick={() => copyToClipboard(card.cvv)} 
              className="ml-2 px-2 py-1 bg-blue-500 text-white rounded"
            >
              Copy
            </button>
          </div>
          <div className="flex items-center">
            <p>Expiration Date: {card.expMonth}/{card.expYear}</p>
            <button 
              onClick={() => copyToClipboard(`${card.expMonth}/${card.expYear}`)} 
              className="ml-2 px-2 py-1 bg-blue-500 text-white rounded"
            >
              Copy
            </button>
          </div>
          <div className="flex items-center">
            <p>Card Holder Name: {card.cardHolderName}</p>
            <button 
              onClick={() => copyToClipboard(card.cardHolderName)} 
              className="ml-2 px-2 py-1 bg-blue-500 text-white rounded"
            >
              Copy
            </button>
          </div>
        </div>
      ))}
    </div>
            </TabsContent>
            <TabsContent value="advanced">
              <Card className="p-6 bg-white shadow-lg rounded-2xl">
                <form className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label className="text-[#6a11cb] font-medium" htmlFor="card-brand">
                        Card Brand/Network
                      </Label>
                      <Select className="rounded-lg" defaultValue="random" id="card-brand">
                        <SelectTrigger className="bg-[#f0f0f0] text-[#6a11cb] hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]">
                          <SelectValue placeholder="Random" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#f0f0f0] text-[#6a11cb] rounded-lg shadow-lg">
                          <SelectItem className="hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]" value="random">
                            Random
                          </SelectItem>
                          <SelectItem className="hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]" value="Visa">
                            Visa
                          </SelectItem>
                          <SelectItem className="hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]" value="Mastercard">
                            Mastercard
                          </SelectItem>
                          <SelectItem className="hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]" value="American Express">
                            American Express
                          </SelectItem>
                          <SelectItem className="hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]" value="Discover">
                            Discover
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label className="text-[#6a11cb] font-medium" htmlFor="country">
                        Country
                      </Label>
                      <Select className="rounded-lg" defaultValue="random" id="country">
                        <SelectTrigger className="bg-[#f0f0f0] text-[#6a11cb] hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]">
                          <SelectValue placeholder="Random" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#f0f0f0] text-[#6a11cb] rounded-lg shadow-lg">
                          <SelectItem className="hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]" value="random">
                            Random
                          </SelectItem>
                          <SelectItem className="hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]" value="usa">
                            United States
                          </SelectItem>
                          <SelectItem className="hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]" value="canada">
                            Canada
                          </SelectItem>
                          <SelectItem className="hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]" value="uk">
                            United Kingdom
                          </SelectItem>
                          <SelectItem className="hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]" value="australia">
                            Australia
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label className="text-[#6a11cb] font-medium" htmlFor="bank">
                        Bank
                      </Label>
                      <Select className="rounded-lg" defaultValue="random" id="bank">
                        <SelectTrigger className="bg-[#f0f0f0] text-[#6a11cb] hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]">
                          <SelectValue placeholder="Random" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#f0f0f0] text-[#6a11cb] rounded-lg shadow-lg">
                          <SelectItem className="hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]" value="random">
                            Random
                          </SelectItem>
                          <SelectItem className="hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]" value="chase">
                            Chase
                          </SelectItem>
                          <SelectItem className="hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]" value="bank-of-america">
                            Bank of America
                          </SelectItem>
                          <SelectItem className="hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]" value="wells-fargo">
                            Wells Fargo
                          </SelectItem>
                          <SelectItem className="hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]" value="citibank">
                            Citibank
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label className="text-[#6a11cb] font-medium" htmlFor="cvv">
                        CVV/CVV2
                      </Label>
                      <Select className="rounded-lg" defaultValue="random" id="cvv">
                        <SelectTrigger className="bg-[#f0f0f0] text-[#6a11cb] hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]">
                          <SelectValue placeholder="Random" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#f0f0f0] text-[#6a11cb] rounded-lg shadow-lg">
                          <SelectItem className="hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]" value="random">
                            Random
                          </SelectItem>
                          <SelectItem className="hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]" value="123">
                            123
                          </SelectItem>
                          <SelectItem className="hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]" value="456">
                            456
                          </SelectItem>
                          <SelectItem className="hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]" value="789">
                            789
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label className="text-[#6a11cb] font-medium" htmlFor="exp-month">
                        Expiration Month
                      </Label>
                      <Select className="rounded-lg" defaultValue="random" id="exp-month">
                        <SelectTrigger className="bg-[#f0f0f0] text-[#6a11cb] hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]">
                          <SelectValue placeholder="Random" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#f0f0f0] text-[#6a11cb] rounded-lg shadow-lg">
                          <SelectItem className="hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]" value="random">
                            Random
                          </SelectItem>
                          <SelectItem className="hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]" value="01">
                            01 - January
                          </SelectItem>
                          <SelectItem className="hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]" value="02">
                            02 - February
                          </SelectItem>
                          <SelectItem className="hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]" value="03">
                            03 - March
                          </SelectItem>
                          <SelectItem className="hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]" value="04">
                            04 - April
                          </SelectItem>
                          <SelectItem className="hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]" value="05">
                            05 - May
                          </SelectItem>
                          <SelectItem className="hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]" value="06">
                            06 - June
                          </SelectItem>
                          <SelectItem className="hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]" value="07">
                            07 - July
                          </SelectItem>
                          <SelectItem className="hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]" value="08">
                            08 - August
                          </SelectItem>
                          <SelectItem className="hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]" value="09">
                            09 - September
                          </SelectItem>
                          <SelectItem className="hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]" value="10">
                            10 - October
                          </SelectItem>
                          <SelectItem className="hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]" value="11">
                            11 - November
                          </SelectItem>
                          <SelectItem className="hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]" value="12">
                            12 - December
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label className="text-[#6a11cb] font-medium" htmlFor="exp-year">
                        Expiration Year
                      </Label>
                      <Select className="rounded-lg" defaultValue="random" id="exp-year">
                        <SelectTrigger className="bg-[#f0f0f0] text-[#6a11cb] hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]">
                          <SelectValue placeholder="Random" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#f0f0f0] text-[#6a11cb] rounded-lg shadow-lg">
                          <SelectItem className="hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]" value="random">
                            Random
                          </SelectItem>
                          <SelectItem className="hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]" value="2024">
                            2024
                          </SelectItem>
                          <SelectItem className="hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]" value="2025">
                            2025
                          </SelectItem>
                          <SelectItem className="hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]" value="2026">
                            2026
                          </SelectItem>
                          <SelectItem className="hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]" value="2027">
                            2027
                          </SelectItem>
                          <SelectItem className="hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]" value="2028">
                            2028
                          </SelectItem>
                          <SelectItem className="hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]" value="2029">
                            2029
                          </SelectItem>
                          <SelectItem className="hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]" value="2030">
                            2030
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label className="text-[#6a11cb] font-medium" htmlFor="money">
                        Money
                      </Label>
                      <Select className="rounded-lg" defaultValue="random" id="money">
                        <SelectTrigger className="bg-[#f0f0f0] text-[#6a11cb] hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]">
                          <SelectValue placeholder="Random" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#f0f0f0] text-[#6a11cb] rounded-lg shadow-lg">
                          <SelectItem className="hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]" value="random">
                            Random
                          </SelectItem>
                          <SelectItem className="hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]" value="100">
                            $100
                          </SelectItem>
                          <SelectItem className="hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]" value="500">
                            $500
                          </SelectItem>
                          <SelectItem className="hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]" value="1000">
                            $1,000
                          </SelectItem>
                          <SelectItem className="hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]" value="5000">
                            $5,000
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label className="text-[#6a11cb] font-medium" htmlFor="quantity">
                        Quantity
                      </Label>
                      <Select className="rounded-lg" defaultValue="1" id="quantity">
                        <SelectTrigger className="bg-[#f0f0f0] text-[#6a11cb] hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]">
                          <SelectValue placeholder="1" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#f0f0f0] text-[#6a11cb] rounded-lg shadow-lg">
                          <SelectItem className="hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]" value="1">
                            1
                          </SelectItem>
                          <SelectItem className="hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]" value="2">
                            2
                          </SelectItem>
                          <SelectItem className="hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]" value="3">
                            3
                          </SelectItem>
                          <SelectItem className="hover:bg-[#e0e0e0] focus:bg-[#e0e0e0]" value="4">
                            4
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      {/* FAQ  */}
      <div className="mt-12 px-4 md:px-6">
        <h2 className="text-2xl font-bold text-white">FAQ</h2>
        <div className="mt-4 space-y-4">
          <details className="bg-white p-4 rounded-lg shadow-md">
            <summary className="font-semibold text-[#6a11cb] cursor-pointer">What is this tool for?</summary>
            <p className="mt-2 text-gray-700">This tool generates valid test credit card numbers for testing purposes, service sign-ups, and payment gateway trials.</p>
          </details>
          <details className="bg-white p-4 rounded-lg shadow-md">
            <summary className="font-semibold text-[#6a11cb] cursor-pointer">How do I generate a card number?</summary>
            <p className="mt-2 text-gray-700">Select the card brand, CVV, expiration month, and year, then click "Generate Cards". You can also choose the quantity of cards to generate.</p>
          </details>
          <details className="bg-white p-4 rounded-lg shadow-md">
            <summary className="font-semibold text-[#6a11cb] cursor-pointer">Can these card numbers be used for real transactions?</summary>
            <p className="mt-2 text-gray-700">No, these card numbers are only for testing purposes and cannot be used for real transactions.</p>
          </details>
        </div>
      </div>
    </section>
  );
}
