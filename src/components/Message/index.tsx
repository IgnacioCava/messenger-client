import { is } from '@/util/functions'
import { UserIcon } from '@components'

const testCases = [
	'Lorem ipsum dolor sit amet, consectetur adi',
	'LoreLoreLoreLoreLoreLoreLoreLoreLoreLoreLoreLoreLoreLoreLoreLoreLoreLoreLoreLoreLoreLoreLoreLoreLoreLor eLoreLoreLoreLoreLoreLoreLoreLoreLoreLoreLoreLore',
	'Lorem ipsum dolor sit amet, consectetur adiLorem ipsum dolor sit amet, consectetur adiLorem ipsum dolor sit amet, consectetur adiLorem ipsum dolor sit amet, consectetur adiLorem ipsum dolor sit amet, consectetur adiLorem ipsum dolor sit amet, consectetur adiLorem ipsum dolor sit amet, consectetur adiLorem ipsum dolor sit amet, consectetur adiLorem ipsum dolor sit amet, consectetur adiLorem ipsum dolor sit amet, consectetur adiLorem ipsum dolor sit amet, consectetur adiLorem ipsum dolor sit amet, consectetur adiLorem ipsum dolor sit amet, consectetur adiLorem ipsum dolor sit amet, consectetur adiLorem ipsum dolor sit amet, consectetur adiLorem ipsum dolor sit amet, consectetur adiLorem ipsum dolor sit amet, consectetur adiLorem ipsum dolor sit amet, consectetur adiLorem ipsum dolor sit amet, consectetur adiLorem ipsum dolor sit amet, consectetur adiLorem ipsum dolor sit amet, consectetur adiLorem ipsum dolor sit amet, consectetur adi'
]

export const Message = ({ direction }: { direction: 'left' | 'right' }) => {
	const right = direction === 'right'
	return (
		<div className={`flex gap-2 ${is(right, 'justify-end')} `}>
			<UserIcon right={right} />
			<div className={`col overflow-hidden ${is(right, 'items-end')}`}>
				<p className='text-sm'>
					{is(right, 'You', 'Other user')} <span className='text-zinc-400'>3:13 PM</span>
				</p>
				{testCases.map((e, index) => (
					<div
						key={index}
						className={`xl:max-w-[60%] lg:max-w-[75%] max-w-[calc(100%-48px)] w-fit break-words whitespace-pre-wrap p-2 rounded ${is(right, 'bg-sky-900', 'bg-zinc-700')} text-sm`}
					>
						{e}
					</div>
				))}
			</div>
		</div>
	)
}
