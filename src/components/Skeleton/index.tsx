interface SkeletonProps {
	className: string
	childrenClassName: string
	count: number
}

export const Skeleton = ({ className, count, childrenClassName }: SkeletonProps) => {
	return (
		<div className={className}>
			{[...Array(count)].map((e, index) => (
				<div key={index} className={`${childrenClassName} animate-skeleton-fade `}></div>
			))}
		</div>
	)
}
