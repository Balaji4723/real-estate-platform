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

function EMICalculator() {

  // Language
  const [language, setLanguage] =
    useState("en")

  const t =
    translations[language]

  // States
  const [loanAmount, setLoanAmount] =
  useState("")

const [interestRate, setInterestRate] =
  useState("")

const [tenure, setTenure] =
  useState("")

const [monthlyIncome, setMonthlyIncome] =
  useState("")
  const [showResult, setShowResult] =
    useState(false)

  // EMI Formula
  const monthlyRate =
    interestRate / 12 / 100

  const months =
    tenure * 12

  const emi =
    loanAmount *
    monthlyRate *
    Math.pow(
      1 + monthlyRate,
      months
    ) /

    (
      Math.pow(
        1 + monthlyRate,
        months
      ) - 1
    )

  const finalEMI =
    isFinite(emi)
      ? emi.toFixed(0)
      : 0

  const totalPayable =
    finalEMI * months

  const totalInterest =
    totalPayable - loanAmount

  // Affordability
  const affordabilityRatio =
    monthlyIncome > 0
      ? Math.round(
          (finalEMI / monthlyIncome) * 100
        )
      : 0

  let affordability = ""

  let affordabilityColor = ""

  let affordabilityBar = ""

  if (affordabilityRatio <= 30) {

    affordability =
      t.comfortableRepayment

    affordabilityColor =
      "text-green-400"

    affordabilityBar =
      "bg-green-500"

  }

  else if (
    affordabilityRatio <= 50
  ) {

    affordability =
      t.manageableRepayment

    affordabilityColor =
      "text-yellow-400"

    affordabilityBar =
      "bg-yellow-400"

  }

  else {

    affordability =
      t.expensiveRepayment

    affordabilityColor =
      "text-red-400"

    affordabilityBar =
      "bg-red-500"

  }

  // Insights
  let insight = ""

  if (tenure >= 15) {

    insight =
      t.longTenureInsight

  }

  else if (interestRate >= 12) {

    insight =
      t.highInterestInsight

  }

  else {

    insight =
      t.balancedInsight

  }

  // Save Report
  const saveEMIReport = async () => {

    const reportData = {

      userEmail:
        auth.currentUser?.email,

      loanAmount,

      interestRate,

      tenure,

      monthlyIncome,

      monthlyEMI: finalEMI,

      totalInterest,

      totalRepayment: totalPayable,

      affordability,

      createdAt:
        new Date()

    }

    try {

      await addDoc(

        collection(
          db,
          "emiReports"
        ),

        reportData

      )

      alert(
        "EMI Report Saved"
      )

    }

    catch (error) {

      console.log(error)

    }

  }

  // PDF
  const downloadEMIPDF = () => {

    const doc = new jsPDF()

    doc.setFontSize(22)

    doc.text(
      "FinSure EMI Report",
      20,
      20
    )

    doc.setFontSize(14)

    doc.text(
      `Loan Amount: Rs.${loanAmount}`,
      20,
      50
    )

    doc.text(
      `Interest Rate: ${interestRate}%`,
      20,
      70
    )

    doc.text(
      `Loan Tenure: ${tenure} Years`,
      20,
      90
    )

    doc.text(
      `Monthly EMI: Rs.${finalEMI}`,
      20,
      110
    )

    doc.text(
      `Total Interest: Rs.${Math.round(totalInterest)}`,
      20,
      130
    )

    doc.text(
      `Total Payable: Rs.${Math.round(totalPayable)}`,
      20,
      150
    )

    doc.save(
      "FinSure_EMI_Report.pdf"
    )

  }

  return (

    <div className="bg-slate-950 min-h-screen text-white p-6 md:p-10">

      {/* Back */}
      <Link to="/">

        <button className="mb-8 bg-cyan-400 text-black px-6 py-3 rounded-xl font-bold hover:bg-cyan-300 transition">

          ← Back

        </button>

      </Link>

      {/* Main */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-10"
      >

        {/* Language */}
        <div className="flex justify-end mb-6">

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

        {/* Heading */}
        <h1 className="text-5xl font-bold text-cyan-400 text-center">

          {t.emiTitle}

        </h1>

        <p className="text-center text-slate-400 mt-5 text-lg">

          {t.emiSubtitle}

        </p>

        {/* Inputs */}
        <div className="grid md:grid-cols-2 gap-8 mt-14">

          <input
            type="number"
            value={loanAmount}
            onChange={(e) =>
              setLoanAmount(Number(e.target.value))
            }
            placeholder={t.loanAmount}
            className="bg-slate-950 border border-slate-700 rounded-2xl p-5 outline-none focus:border-cyan-400"
          />

          <input
            type="number"
            value={interestRate}
            onChange={(e) =>
              setInterestRate(Number(e.target.value))
            }
            placeholder={t.interestRate}
            className="bg-slate-950 border border-slate-700 rounded-2xl p-5 outline-none focus:border-cyan-400"
          />

          <input
            type="number"
            value={tenure}
            onChange={(e) =>
              setTenure(Number(e.target.value))
            }
            placeholder={t.loanTenure}
            className="bg-slate-950 border border-slate-700 rounded-2xl p-5 outline-none focus:border-cyan-400"
          />

          <input
            type="number"
            value={monthlyIncome}
            onChange={(e) =>
              setMonthlyIncome(Number(e.target.value))
            }
            placeholder={t.salary}
            className="bg-slate-950 border border-slate-700 rounded-2xl p-5 outline-none focus:border-cyan-400"
          />

        </div>

        {/* Calculate Button */}
        <div className="flex justify-center mt-10">

          <button
            onClick={() =>
              setShowResult(true)
            }
            className="bg-cyan-400 text-black px-10 py-4 rounded-2xl font-bold hover:bg-cyan-300 transition duration-300 shadow-lg shadow-cyan-500/20"
          >

            Calculate EMI

          </button>

        </div>

        {/* Results */}
        {showResult && (

          <>
            {/* Analytics */}
            <div className="grid md:grid-cols-3 gap-8 mt-14">

              {/* EMI */}
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="bg-slate-950 border border-slate-800 rounded-3xl p-8 text-center"
              >

                <h2 className="text-cyan-400 text-2xl font-bold">

                  {t.monthlyEmi}

                </h2>

                <p className="text-5xl font-extrabold mt-6">

                  ₹ {Number(finalEMI).toLocaleString()}

                </p>

              </motion.div>

              {/* Interest */}
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="bg-slate-950 border border-slate-800 rounded-3xl p-8 text-center"
              >

                <h2 className="text-cyan-400 text-2xl font-bold">

                  {t.totalInterest}

                </h2>

                <p className="text-5xl font-extrabold mt-6">

                  ₹ {Math.round(totalInterest).toLocaleString()}

                </p>

              </motion.div>

              {/* Payable */}
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="bg-slate-950 border border-slate-800 rounded-3xl p-8 text-center"
              >

                <h2 className="text-cyan-400 text-2xl font-bold">

                  {t.totalPayable}

                </h2>

                <p className="text-5xl font-extrabold mt-6">

                  ₹ {Math.round(totalPayable).toLocaleString()}

                </p>

              </motion.div>

            </div>

            {/* Affordability */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="mt-10 bg-slate-950 border border-slate-800 rounded-3xl p-8"
            >

              <h2 className="text-3xl font-bold text-cyan-400">

                {t.affordabilityAnalysis}

              </h2>

              <p className={`text-4xl font-bold mt-8 ${affordabilityColor}`}>

                {affordability}

              </p>

              <div className="mt-10">

                <div className="flex justify-between mb-3 text-lg">

                  <span>
                    {t.incomeUtilization}
                  </span>

                  <span>
                    {affordabilityRatio}%
                  </span>

                </div>

                <div className="w-full h-5 bg-slate-800 rounded-full overflow-hidden">

                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${affordabilityRatio}%`
                    }}
                    transition={{
                      duration: 1
                    }}
                    className={`h-5 rounded-full ${affordabilityBar}`}
                  />

                </div>

              </div>

              <p className="mt-8 text-lg text-slate-300 leading-relaxed">

                {insight}

              </p>

            </motion.div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-6 mt-10 justify-center">

              <button
                onClick={saveEMIReport}
                className="bg-cyan-400 text-black px-8 py-4 rounded-2xl font-bold hover:bg-cyan-300 transition duration-300 shadow-xl shadow-cyan-500/20"
              >

                {t.saveEmi}

              </button>

              <button
                onClick={downloadEMIPDF}
                className="border border-cyan-400 px-8 py-4 rounded-2xl font-bold hover:bg-cyan-400 hover:text-black transition duration-300"
              >

                {t.downloadEmi}

              </button>

            </div>

          </>

        )}

      </motion.div>

    </div>
  )
}

export default EMICalculator