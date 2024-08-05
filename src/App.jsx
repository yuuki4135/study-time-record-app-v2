import { useState } from 'react'

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fvkzpaeinzoxaniwyqqi.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

function App() {
  const [records, setRecords] = useState([])
  const [title, setTitle] = useState('')
  const [time, setTime] = useState(0)
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!title || typeof time != 'number') {
      setError('入力されていない項目があります')
    }else{
      setRecords([...records, { title, time }])
      setTitle('')
      setTime(0)
      setError('')
    }
  }

  return (
    <>
      <h1>学習記録一覧</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            学習内容
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            学習時間
            <input
              type="number"
              value={time}
              onChange={(e) => setTime(Number(e.target.value))}
            />
            時間
          </label>
        </div>
        <div>
          入力されている学習内容: {title}
        </div>
        <div>
          入力されている学習時間: {time}時間
        </div>
        {records.map((record, index) => (
          <div key={index}>
            {record.title}: {record.time}時間
          </div>
        ))}
        <button type="submit">追加</button>
        <div>{error}</div>
        <div>合計時間: {records.reduce((acc, record) => acc + record.time, 0)} / 1000 (h)</div>
      </form>
    </>
  )
}

export default App
