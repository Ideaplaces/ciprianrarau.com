const Debug = () => {
  const handleClick = () => {
    throw new Error('Test error')
  }

  return (
    <div>
      <button onClick={handleClick}>Debug</button>
    </div>
  )
}

export default Debug
