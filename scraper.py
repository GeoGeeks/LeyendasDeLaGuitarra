import pandas as pd
import requests
import time

# read input csv file
df = pd.read_csv('itunes_ids.csv')

# create otuput DataFrame
cols = ['rank', 'artist', 'track', 'preview_url', 'artwork_url']
out_df = pd.DataFrame(columns=cols)

for i, row in df.iterrows():

    # get the song id and make a call to the iTunes API
    song_id = row['song_id']
    r = requests.get(f'http://itunes.apple.com/us/lookup?id={song_id}').json()
    r = r['results'][0]

    # populate output DataFrame
    out_df.loc[i, 'rank'] = row['rank']
    out_df.loc[i, 'artist'] = r['artistName']
    out_df.loc[i, 'track'] = r['trackName']
    out_df.loc[i, 'preview_url'] = r['previewUrl']
    out_df.loc[i, 'artwork_url'] = r['artworkUrl100']

    print(f"{row['name']} ready...")

    # wait 3 seconds before making the next call
    time.sleep(3)

out_df.to_csv('songs_info.csv', index=False)