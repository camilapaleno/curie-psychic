import React from "react";
import { useState } from "react";
import './App.css';
import Lottie from "lottie-react";
import Eye from "./eye.json";
const { Configuration, OpenAIApi } = require("openai");

function Curie() {
    
    const [ name , setName ] = useState([''])
    const [ showPrompt , setShowPrompt] = useState('promptHide')

    const onNameChoice = (event) => {
        event.preventDefault()
        const formData = new FormData(event.target),
        formDataObj = Object.fromEntries(formData.entries())
        setName(formDataObj.name);
        setShowPrompt('promptShow');
    }

    const reactions = [
        {
            reaction: "Hm. This choice says a lot about you."
        },
        {
            reaction: "Interesting."
        },
        {
            reaction: "Oh, alright."
        },
        {
            reaction: "Ok."
        }
      ];

    const [ randomReaction , setRandomReaction ] = useState(0)
    const pickRandomReaction = () => {
        const rand = Math.floor(Math.random() * reactions.length);
        setRandomReaction(rand);
    }

    const [ reading , setReading ] = useState([''])

    const [ readingList , setreadingList ] = useState([''])

    const onTopicChoice = async (event) => {

        event.preventDefault()
        const formData = new FormData(event.target),
        formDataObj = Object.fromEntries(formData.entries())
        console.log(formDataObj.readingTopic)

        const configuration = new Configuration({
            apiKey: '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',
          });
        
        const openai = new OpenAIApi(configuration);

        const response = await openai.createCompletion("text-curie-001", {
            prompt: `Tell me a creepy and interesting fortune about my future with ${formDataObj.readingTopic}`,
            temperature: 0.9,
            max_tokens: 256,
            top_p: 1,
            frequency_penalty: 1,
            presence_penalty: 1,
          }
        )

        pickRandomReaction();

        setReading(reactions[randomReaction].reaction + response.data.choices[0].text + ' Want to learn more? Try typing another word.');
        
        setreadingList(list => [...list, {prompt: formDataObj.readingTopic, response: reactions[randomReaction].reaction + response.data.choices[0].text}])
    }


        return (
            <div className="container">
            
            <div className="eye"><Lottie animationData={Eye} loop="true" /></div>
            
            <div className="text">

                <form onSubmit={onNameChoice}>
                        <label>Hello, I'm Curie. I can see into your future. What is your name?</label>
                        <br/>
                        <input type="text" name="name" placeholder="type here and press enter." />
                    <button type="submit"></button>
                </form>
                
                <form onSubmit={onTopicChoice} className={showPrompt}>
                        <label>Nice to meet you, {name}. What aspect of your future would you like me to explore? <b>Answer in one word</b>. Choose wisely.</label>
                        <br/>
                        <input type="text" name="readingTopic" placeholder="type here and press enter." />
                    <button type="submit"></button>
                </form>
                
                <p>{reading}</p>

                <div className="readingList">
                    {readingList.map((item) => (
                        <div key={item} >
                          {Object.values(item).map((prompt) => (
                            <p>{prompt}</p>
                          ))}
                        </div>
                      ))}

                </div>


            </div>
        </div>
        )
  }

  export default Curie
  