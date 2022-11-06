import reader from "xlsx";
import fetch from "node-fetch";

// Reading our test file
const file = reader.readFile('./TournamentResponses.xlsx')
  
let data = []
  
const sheets = file.SheetNames

// Player Object for storing name + rating from Corestrike.gg
const players = []

// Fetch player data function
async function getPlayerData (name) {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };

    const res = await fetch(`https://corestrike.gg/lookup/${name}?json=true`, requestOptions);
    const fetchResponse = await res.json();
    return Promise.resolve(fetchResponse.rankedStats);
}

async function runScript() {
  // Taking info from excel sheet and putting it into data object
  for(let i = 0; i < sheets.length; i++)
  {
    const temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[i]])
    temp.forEach(async (res) => {
      data.push(res);
    })
  }
  
  // Pulling information from Corestrike.gg
  for(let i = 0; i < data.length; i++){
    const playerName = data[i]['Please enter your account name exactly how it appears in game.\n\nI need to be able to check your rank on Corestrike.gg, if I cannot you will be disqualified'];
    const playerStats = await getPlayerData(playerName);
    players.push(
      {
        Name: playerName,
        Rating: playerStats.rating,
        Rank: playerStats.rating_display,
        Position: data[i]['What is your primary position in Omega Strikers?']
      }        
    ) 
    // console.log(data);
  }

  console.log(players);
}

await runScript();

// console.log(data);


