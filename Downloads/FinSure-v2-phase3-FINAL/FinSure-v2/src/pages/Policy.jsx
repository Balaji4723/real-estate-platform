import Navbar from "../components/Navbar"
import { useState } from "react"

import translations from "../translations/translations"

import { motion } from "framer-motion"

import { Link } from "react-router-dom"

import jsPDF from "jspdf"

import { auth } from "../firebase"

import {
  addDoc,
  collection
} from "firebase/firestore"

import { db } from "../firebase"

function Policy() {

  // Language
  const [language, setLanguage] =
    useState("en")

  const t =
    translations[language]

  // States
  const [loanType, setLoanType] =
    useState("")

  const [salary, setSalary] =
    useState("")

  const [loanAmount, setLoanAmount] =
    useState("")

  const [existingEmi, setExistingEmi] =
    useState("")

  const [tenure, setTenure] =
    useState("")

  const [result, setResult] =
    useState(null)

  // Analyze
  const analyzeLoan = async () => {

    // Interest Rates
    const rates = {

      home: 8.5,

      personal: 14,

      education: 9,

      car: 10

    }

    const interest =
      rates[loanType] || 10

    const monthlyRate =
      interest / 12 / 100

    const months =
      tenure * 12

    // EMI Formula
    const emi = Math.round(

      (
        loanAmount *
        monthlyRate *
        Math.pow(
          1 + monthlyRate,
          months
        )
      ) /

      (
        Math.pow(
          1 + monthlyRate,
          months
        ) - 1
      )

    )

    // Liability
    const totalLiability =
      emi + Number(existingEmi)

    const ratio = Math.round(

      (
        totalLiability / salary
      ) * 100

    )

    let approval = 0

    let risk = ""

    let insight = ""

    let color = ""

    let ratioColor = ""

    let banks = []

    // LOW RISK
    if (ratio <= 35) {

      approval = 90

      risk =
        "Low Financial Risk"

      color =
        "bg-green-500"

      ratioColor =
        "bg-green-500"

      insight =
        "Your financial profile appears strong for this loan structure."

      banks = [

        {
          name: "SBI",

          reason:
            "Suitable for stable salaried applicants seeking lower interest rates.",

          rate: "8.5%"
        },

        {
          name: "HDFC",

          reason:
            "Good for faster processing and flexible repayment options.",

          rate: "9.1%"
        }

      ]

    }

    // MODERATE
    else if (
      ratio <= 50
    ) {

      approval = 70

      risk =
        "Moderate Financial Pressure"

      color =
        "bg-yellow-400"

      ratioColor =
        "bg-yellow-400"

      insight =
        "Moderate repayment burden detected. Approval remains possible with stable income."

      banks = [

        {
          name: "ICICI",

          reason:
            "Suitable for moderate financial profiles and digital loan processing.",

          rate: "9.4%"
        },

        {
          name: "Axis Bank",

          reason:
            "Flexible repayment structures for moderate EMI obligations.",

          rate: "9.7%"
        }

      ]

    }

    // HIGH RISK
    else {

      approval = 45

      risk =
        "High Financial Risk"

      color =
        "bg-red-500"

      ratioColor =
        "bg-red-500"

      insight =
        "Current repayment structure may create financial pressure based on income profile."

      banks = [

        {
          name: "NBFC Lenders",

          reason:
            "Possible approvals but interest rates may be higher.",

          rate: "11%+"
        },

        {
          name: "Private Banks",

          reason:
            "Approval may require stronger financial stability.",

          rate: "10.5%"
        }

      ]

    }

    // Save
    const reportData = {

      userEmail:
        auth.currentUser?.email,

      loanType,

      salary,

      loanAmount,

      existingEmi,

      tenure,

      emi,

      approval,

      ratio,

      risk,

      insight,

      createdAt:
        new Date()

    }

    try {

      await addDoc(

        collection(
          db,
          "reports"
        ),

        reportData

      )

    }

    catch (error) {

      console.log(error)

    }

    // UI Update
    setResult({

      emi,

      approval,

      ratio,

      risk,

      insight,

      color,

      ratioColor,

      banks

    })

  }

  // PDF
  const downloadReport = () => {

    if (!result) return

    const doc = new jsPDF()

    doc.setFontSize(22)

    doc.text(
      "FinSure Financial Report",
      20,
      20
    )

    doc.setFontSize(14)

    doc.text(
      `Loan Type: ${loanType}`,
      20,
      45
    )

    doc.text(
      `Monthly Salary: Rs.${salary}`,
      20,
      60
    )

    doc.text(
      `Loan Amount: Rs.${loanAmount}`,
      20,
      75
    )

    doc.text(
      `Existing EMI: Rs.${existingEmi}`,
      20,
      90
    )

    doc.text(
      `Loan Tenure: ${tenure} Years`,
      20,
      105
    )

    doc.text(
      `Estimated EMI: Rs.${result.emi}`,
      20,
      125
    )

    doc.text(
      `Approval Probability: ${result.approval}%`,
      20,
      140
    )

    doc.text(
      `EMI Ratio: ${result.ratio}%`,
      20,
      155
    )

    doc.text(
      `Risk Level: ${result.risk}`,
      20,
      170
    )

    doc.save(
      "FinSure_Financial_Report.pdf"
    )

  }

  return (

    <div className="bg-slate-950 min-h-screen text-white p-6 md:p-10 overflow-hidden relative">

      {/* Back */}
      <Link to="/">

        <button className="mb-8 bg-cyan-400 text-black px-6 py-3 rounded-xl font-bold hover:bg-cyan-300 transition relative z-10">

          ← Back

        </button>

      </Link>

      {/* Background Glow */}
      <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-cyan-500 opacity-20 blur-[120px] rounded-full"></div>

      <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-purple-500 opacity-20 blur-[120px] rounded-full"></div>

      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center relative z-10"
      >

        {/* Language */}
        <div className="flex justify-end mb-8">

          <select
            value={language}
            onChange={(e) =>
              setLanguage(e.target.value)
            }
            className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 outline-none"
          >

            <option value="en">
              English
            </option>

            <option value="hi">
              हिंदी
            </option>

            <option value="mr">
              Marathi
            </option>

          </select>

        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold text-cyan-400">

  Loan Feasibility Analyzer

</h1>

        <p className="text-slate-400 mt-6 text-lg max-w-3xl mx-auto leading-relaxed">

       Analyze loan feasibility, repayment pressure and financial approval strength.

        </p>

      </motion.div>

      {/* Input Section */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-5xl mx-auto mt-16 bg-slate-900/80 backdrop-blur-lg border border-slate-800 rounded-3xl p-10 relative z-10"
      >

        <div className="grid md:grid-cols-2 gap-6">

          {/* Loan Type */}
          <select
            value={loanType}
            onChange={(e) =>
              setLoanType(e.target.value)
            }
            className="bg-slate-950 border border-slate-700 rounded-2xl p-5 outline-none focus:border-cyan-400"
          >

            <option value="">
              {t.loanType}
            </option>

            <option value="home">
              {t.homeLoan}
            </option>

            <option value="personal">
              {t.personalLoan}
            </option>

            <option value="education">
              {t.educationLoan}
            </option>

            <option value="car">
              {t.carLoan}
            </option>

          </select>

          {/* Salary */}
          <input
            type="number"
            placeholder={t.salary}
            value={salary}
            onChange={(e) =>
              setSalary(e.target.value)
            }
            className="bg-slate-950 border border-slate-700 rounded-2xl p-5 outline-none focus:border-cyan-400"
          />

          {/* Loan Amount */}
          <input
            type="number"
            placeholder={t.loanAmount}
            value={loanAmount}
            onChange={(e) =>
              setLoanAmount(e.target.value)
            }
            className="bg-slate-950 border border-slate-700 rounded-2xl p-5 outline-none focus:border-cyan-400"
          />

          {/* Existing EMI */}
          <input
            type="number"
            placeholder={t.existingEmi}
            value={existingEmi}
            onChange={(e) =>
              setExistingEmi(e.target.value)
            }
            className="bg-slate-950 border border-slate-700 rounded-2xl p-5 outline-none focus:border-cyan-400"
          />

          {/* Tenure */}
          <input
            type="number"
            placeholder={t.loanTenure}
            value={tenure}
            onChange={(e) =>
              setTenure(e.target.value)
            }
            className="bg-slate-950 border border-slate-700 rounded-2xl p-5 outline-none focus:border-cyan-400"
          />

        </div>

        {/* Analyze Button */}
        <button
          onClick={analyzeLoan}
          className="w-full mt-8 bg-cyan-400 text-black py-5 rounded-2xl font-bold hover:bg-cyan-300 transition duration-300 text-lg shadow-xl shadow-cyan-500/20"
        >

         Analyze Financial Feasibility

        </button>

      </motion.div>

      {/* Results */}
      {result && (

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-2 gap-8 mt-16 relative z-10"
        >

          {/* Approval */}
          <div className="bg-slate-900/80 backdrop-blur-lg border border-slate-800 rounded-3xl p-10">

            <h2 className="text-3xl font-bold text-cyan-400">

              Banking Analysis

            </h2>

            {/* Approval */}
            <div className="mt-10">

              <div className="flex justify-between mb-3 text-lg">

                <span>
                  Approval Probability
                </span>

                <span>
                  {result.approval}%
                </span>

              </div>

              <div className="w-full bg-slate-800 rounded-full h-5 overflow-hidden">

                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${result.approval}%`
                  }}
                  transition={{
                    duration: 1
                  }}
                  className={`${result.color} h-5 rounded-full`}
                />

              </div>

            </div>

            {/* EMI Ratio */}
            <div className="mt-10">

              <div className="flex justify-between mb-3 text-lg">

                <span>
                  EMI Burden Ratio
                </span>

                <span>
                  {result.ratio}%
                </span>

              </div>

              <div className="w-full bg-slate-800 rounded-full h-5 overflow-hidden">

                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${result.ratio}%`
                  }}
                  transition={{
                    duration: 1
                  }}
                  className={`${result.ratioColor} h-5 rounded-full`}
                />

              </div>

            </div>

            {/* Metrics */}
            <div className="mt-10 space-y-6 text-lg">

              <p>

                Estimated EMI:
                {" "}
                ₹ {result.emi}

              </p>

              <p>

                Risk Level:
                {" "}
                {result.risk}

              </p>

            </div>

          </div>

          {/* Insights */}
          <div className="bg-slate-900/80 backdrop-blur-lg border border-slate-800 rounded-3xl p-10">

            <h2 className="text-3xl font-bold text-cyan-400">

              {t.bankingInsight}

            </h2>

            <div className="mt-10 space-y-6 text-lg leading-relaxed">

              <p>

                {result.insight}

              </p>

              <p>

                Banks generally prefer EMI obligations below 40% of monthly income.

              </p>

              <p>

                Stable income and lower liabilities improve approval probability significantly.

              </p>

            </div>

          </div>

          {/* Suggested Banks */}
          <div className="bg-slate-900/80 backdrop-blur-lg border border-slate-800 rounded-3xl p-10 md:col-span-2">

            <h2 className="text-3xl font-bold text-cyan-400">

              Suggested Banking Profiles

            </h2>

            <div className="grid md:grid-cols-2 gap-6 mt-10">

              {result.banks.map(
                (bank, index) => (

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    key={index}
                    className="bg-slate-950 border border-slate-700 rounded-2xl p-6"
                  >

                    <h3 className="text-2xl font-bold text-cyan-400">

                      {bank.name}

                    </h3>

                    <p className="text-slate-300 mt-4 leading-relaxed">

                      {bank.reason}

                    </p>

                    <p className="mt-4 text-lg">

                      Interest Range:
                      {" "}
                      {bank.rate}

                    </p>

                  </motion.div>

                )
              )}

            </div>

          </div>

          {/* Download */}
          <div className="md:col-span-2 flex justify-center">

            <button
              onClick={downloadReport}
              className="bg-cyan-400 text-black px-10 py-5 rounded-2xl font-bold hover:bg-cyan-300 transition duration-300 shadow-xl shadow-cyan-500/20"
            >

              {t.downloadPdf}

            </button>

          </div>

        </motion.div>

      )}

    </div>
  )
}

export default Policy