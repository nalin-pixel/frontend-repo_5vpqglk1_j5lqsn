export default function ExportPanel({ schedule }) {
  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(schedule || {}, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `turnus-${schedule?.year}-${schedule?.month}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportCSV = () => {
    const rows = [['employee_id','date','shift']]
    for (const a of schedule?.assignments || []) rows.push([a.employee_id, a.date, a.shift])
    const csv = rows.map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `turnus-${schedule?.year}-${schedule?.month}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <section id="export" className="py-8">
      <h2 className="text-lg font-semibold mb-3">Export</h2>
      <div className="bg-white border rounded-xl p-4 flex gap-2">
        <button onClick={exportJSON} className="bg-slate-900 text-white rounded px-3 py-2">Export JSON</button>
        <button onClick={exportCSV} className="bg-slate-100 border rounded px-3 py-2">Export CSV</button>
        <div className="text-sm text-slate-600 self-center">PDF and Visma Ressurs formats can be added later.</div>
      </div>
    </section>
  )
}
