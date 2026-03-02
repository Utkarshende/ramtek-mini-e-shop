import React from 'react'

function PageHeader({title,highlight,subtitle}) {
  return (
    <div>
      <h1 className='text-4xl font-bold tracking-tight'>
        {title}
        {highlight && (
            <span className='text-blue-500'>
                {highlight}
            </span>
        )}
      </h1>
      {subtitle && (
        <p className='text-slate-400 mt-3'>
            {subtitle}
        </p>
      )}
    </div>
  )
}

export default PageHeader
