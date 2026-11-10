import React from 'react'
import {Bot, Computer, DatabaseZap, FileBraces, LucideWorkflow, CircleStar} from 'lucide-react'

const Features = [
    {icon: <Computer size={100}/>, head: "High Flexibility", description: "Teachers can create a test anytime and complete at any time. Also any tests can be edited anytime unless it was not marked completed"},
    {icon: <Bot size={100}/>, head: "Image to Question", description: "Teachers can take pictures of ques and add it. It automatically detects the question and adds it in appropriate format"},
    {icon: <DatabaseZap size={100}/>, head: "Data Focussed System", description: "When Students give tests, Teachers get heavy amounts of data which they can analyze and catch weaknesses of particular students"},
    {icon: <LucideWorkflow size={100}/>, head: "Adding Solution is Optional", description: "When a question is added, AI automatically detects the ques, solves it by various resources and adds a verified Solution"},
    {icon: <FileBraces size={100}/>, head: "Multiple Formats", description: "Tests of multiple formats like MSQs, MCQs, Integer, Numerical can be collectively added to a single Test"},
]

function FeaturesPart() {
  return (
    <div className='bg-gray-950'>
        <div className='flex gap-1 items-center px-5 pt-5'>
            <CircleStar className='text-white' />
            <div className='text-white text-4xl p-5'>Features of Our Platform</div>
        </div>

        {/* #24 — added key={f.head} on each FeatureCard */}
        <div className='grid grid-cols-1 md:grid-cols-3 2xl:grid-cols-5 gap-2 p-3 sm:px-20 px-10'>
            {Features.map(f => (
                <FeatureCard
                    key={f.head}
                    icon={f.icon}
                    head={f.head}
                    description={f.description}
                />
            ))}
        </div>
    </div>
  )
}

export default FeaturesPart


const FeatureCard = ({icon, head, description}) => {
    return (
        <div className='p-5 text-white flex flex-col items-center text-center bg-gray-800 rounded border border-white'>
            <div className='py-10'>{icon}</div>
            <div className='text-3xl font-bold'>{head}</div>
            <div className='text-sm mt-2'>{description}</div>
        </div>
    )
}
