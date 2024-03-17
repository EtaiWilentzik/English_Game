import React, { useEffect, useState } from 'react';
import './StatisticsScreen.css';

const StatisticsScreen = ({ username, goBack }) => {
    //im not sure why we need the top5Data. for what case that we want to present.

    const [game1, setGame1] = useState([]);
    const [game2, setGame2] = useState([]);
    const [lastGames, setlastGames] = useState([]);
    const [averageAccuracy,setAverageAccuracy]=useState("")
    const [classPosition,setclassPosition]=useState("")
    const [classAndHakbatza,setClassAndHakbatza]=useState("")
    const [removeUser,setRemoveUser]=useState("")
    const [removeButtonClicked, setRemoveButtonClicked] = useState(false);




    const subtitleText = (
        <div>
            <div>Rank: {classPosition}</div>
            <div>Level & Class Position: {classAndHakbatza}</div>
            <div>Average Accuracy: {averageAccuracy}</div>
        </div>
    );




const serverStatus=(response,setter)=>{
    if (response.status === "success") {
        setter(response.message);
    }
    else {
        // Handle error response from the server
        console.error('Error:', response.message);

    }

}
    useEffect(() => {
        // const fetchStatistics = async () => {
        //     try {
        //         const statisticsResponse = await fetch(`/statistics`);
        //         const statisticsData = await statisticsResponse.json();
        //         serverStatus(statisticsData,setTop5Data)
        //
        //     } catch (error) {
        //         console.error('Fetch error:', error);
        //         throw error;
        //     }
        // };
        //         //this is the top 5 users that has
        // const fetchStreak = async () => {
        //     try {
        //         const streakResponse = await fetch(`/streak`);
        //         const streakData = await streakResponse.json();
        //         console.log(streakData)
        //         serverStatus(streakData,setStreak)
        //     } catch (error) {
        //         console.error('Fetch error:', error);
        //     }
        // };
        const fetchAverageAccuracy = async () => {
            try {
                console.log("im at fetchAverageAccuracy ")
                const averageAccuracyResponse = await fetch(`/averageAccuracy?username=${username}`);
                const averageAccuracy = await averageAccuracyResponse.json();
                        serverStatus(averageAccuracy,setAverageAccuracy)

            } catch (error) {
                console.error('Fetch error:', error);
            }
        };
        const classPosition = async () => {
            try {
                console.log("im at fetchAverageAccuracy ")
                const Response = await fetch(`/classRate?username=${username}`);
                const classResponse = await Response.json();
                serverStatus(classResponse,setclassPosition)

            } catch (error) {
                console.error('Fetch error:', error);
            }
        };
        const classAndHakbatzaRate = async () => {
            try {
                console.log("im at fetchAverageAccuracy ")
                const Response = await fetch(`/classAndHakbatzaRate?username=${username}`);
                const classResponse = await Response.json();
                serverStatus(classResponse,setClassAndHakbatza)

            } catch (error) {
                console.error('Fetch error:', error);
            }
        };


        const game1Score = async () => {
            try {
                const game1Response = await fetch(`/game1Score`);
                const game1Data = await game1Response.json();
                console.log(game1Data)
                serverStatus(game1Data,setGame1)
            } catch (error) {
                console.error('Fetch error:', error);
            }
        };


        const game2Score = async () => {
            try {
                const game2Response = await fetch(`/game2Score`);
                const game2Data = await game2Response.json();
                console.log(game2Data)
                serverStatus(game2Data,setGame2)
            } catch (error) {
                console.error('Fetch error:', error);
            }
        };

        const lastGames = async () => {
            try {
                const Response = await fetch(`/getLastGames?username=${username}`);
                const lastGameRes = await Response.json();
                console.log("the last game is "+lastGameRes)
                serverStatus(lastGameRes,setlastGames)
            } catch (error) {
                console.error('Fetch error:', error);
            }
        };


        // fetchStatistics() // Fetch statistics first
        // fetchStreak(); // Once statistics is fetched, fetch streak
        fetchAverageAccuracy()
        classPosition()
        game1Score()
        game2Score()
        classAndHakbatzaRate()
        lastGames()

    }, [removeUser]); // Empty dependency array to run only once //every time the user is removed i want to to refresh the data.


 const handleRemove=  ()=>{
     const removeUser = async () => {
         if (!removeButtonClicked) { // Change this line to check if the button has not been clicked
             try {
                 const Response = await fetch(`/removeUserLog?username=${username}`);
                 const ResponseRemove = await Response.json();
                 serverStatus(ResponseRemove, setRemoveUser);
                 setRemoveButtonClicked(true); // Mark button as clicked
             } catch (error) {
                 console.error('Fetch error:', error);
             }
         }
     };
       removeUser()
     };





    return (
        <div className="center">
            <h1>Statistics</h1>
            <h2>{subtitleText}</h2>

            <div className="tables-container">





                {/* Game 1 table- Definition  */}
                <table className="custom-table">
                    <thead>
                    <tr>
                        <th>top 5</th>
                        <th>Username</th>
                        <th>Total Wins - Definition game</th>

                    </tr>
                    </thead>
                    <tbody>
                    {game1.map((row, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{row.username}</td>
                            <td>{row.Accuracy}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>





                {/* Game 2 table - Synonyms */}
                <table className="custom-table">
                    <thead>
                    <tr>
                        <th>top 5</th>
                        <th>Username</th>
                        <th>Total Wins - Synonyms game</th>

                    </tr>
                    </thead>
                    <tbody>
                    {game2.map((row, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{row.username}</td>
                            <td>{row.Accuracy}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>


                {/*/!*  last 5 gampes by the user  Table *!/*/}
                <table className="custom-table">
                    <thead>
                    <tr>
                        <th>Username</th>
                        <th>Type Of game</th>
                        <th>Result</th>
                        <th>Accuracy</th>
                        <th>   date       </th>

                    </tr>
                    </thead>
                    <tbody>
                    {lastGames.map((row, index) => (
                        <tr key={index}>
                            <td>{row.username}</td>
                            <td>{row.TypeOfGame}</td>
                            <td>{row.Result}</td>
                            <td>{row.Accuracy}</td>
                            <td>{row.Date}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>

            </div>

            {/* Back Button */}
            <button className="custom-button" onClick={goBack}>
                Back
            </button>
            {!removeButtonClicked && (
                <button  className="custom-button" onClick={handleRemove} disabled={removeButtonClicked}>
                    Remove All My User Data {removeUser}
                </button>
            )}


        </div>
    );
};

export default StatisticsScreen;
