import GoogleMap from '@/components/GoogleMap'
import MapsSearchForm from './MapsSearchForm'


export default function BucketList() {


  return (
    <div className='flex flex-grow border-t'>
      <GoogleMap />
      <div className='w-1/4 bg-neutral-950'>
        <div className='p-4'>
          <MapsSearchForm />
        </div>
      </div>
    </div>
  )
}
