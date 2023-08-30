import { SkeletonProps } from '@components'

export const Skeleton = ({ className, count, childrenClassName }: SkeletonProps) => {
	return (
		<div className={className}>
			{[...Array(count)].map((e, index) => (
				<div key={index} className={`${childrenClassName} animate-skeleton-fade `}></div>
			))}
		</div>
	)
}
