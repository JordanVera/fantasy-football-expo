export type NFLTeam =
  | 'ARI'
  | 'ATL'
  | 'BAL'
  | 'BUF'
  | 'CAR'
  | 'CHI'
  | 'CIN'
  | 'CLE'
  | 'DAL'
  | 'DEN'
  | 'DET'
  | 'GB'
  | 'HOU'
  | 'IND'
  | 'JAX'
  | 'KC'
  | 'LAC'
  | 'LAR'
  | 'LV'
  | 'MIA'
  | 'MIN'
  | 'NE'
  | 'NO'
  | 'NYG'
  | 'NYJ'
  | 'PHI'
  | 'PIT'
  | 'SEA'
  | 'SF'
  | 'TB'
  | 'TEN'
  | 'WAS';

interface Team {
  abbreviation: NFLTeam;
  name: string;
}

const TEAMS: Team[] = [
  { abbreviation: 'ARI', name: 'Cardinals' },
  { abbreviation: 'ATL', name: 'Falcons' },
  { abbreviation: 'BAL', name: 'Ravens' },
  { abbreviation: 'BUF', name: 'Bills' },
  { abbreviation: 'CAR', name: 'Panthers' },
  { abbreviation: 'CHI', name: 'Bears' },
  { abbreviation: 'CIN', name: 'Bengals' },
  { abbreviation: 'CLE', name: 'Browns' },
  { abbreviation: 'DAL', name: 'Cowboys' },
  { abbreviation: 'DEN', name: 'Broncos' },
  { abbreviation: 'DET', name: 'Lions' },
  { abbreviation: 'GB', name: 'Packers' },
  { abbreviation: 'HOU', name: 'Texans' },
  { abbreviation: 'IND', name: 'Colts' },
  { abbreviation: 'JAX', name: 'Jaguars' },
  { abbreviation: 'KC', name: 'Chiefs' },
  { abbreviation: 'LAC', name: 'Chargers' },
  { abbreviation: 'LAR', name: 'Rams' },
  { abbreviation: 'LV', name: 'Raiders' },
  { abbreviation: 'MIA', name: 'Dolphins' },
  { abbreviation: 'MIN', name: 'Vikings' },
  { abbreviation: 'NE', name: 'Patriots' },
  { abbreviation: 'NO', name: 'Saints' },
  { abbreviation: 'NYG', name: 'Giants' },
  { abbreviation: 'NYJ', name: 'Jets' },
  { abbreviation: 'PHI', name: 'Eagles' },
  { abbreviation: 'PIT', name: 'Steelers' },
  { abbreviation: 'SEA', name: 'Seahawks' },
  { abbreviation: 'SF', name: '49ers' },
  { abbreviation: 'TB', name: 'Buccaneers' },
  { abbreviation: 'TEN', name: 'Titans' },
  { abbreviation: 'WAS', name: 'Commanders' },
];

export default TEAMS;
