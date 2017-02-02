drop table rank_institution_archive;
create table rank_institution_archive as
select distinct ee.institution as name, 
		IFNULL(tse.num, 0) as TSE, IFNULL(tosem.num, 0) as TOSEM, 
		IFNULL(ist.num, 0) as IST, IFNULL(jss.num, 0) as JSS, IFNULL(stvr.num, 0) as STVR, IFNULL(emse.num, 0) as EMSE,
		IFNULL(icse.num, 0) as ICSE, IFNULL(fse.num, 0) as FSE,
		IFNULL(ase.num, 0) as ASE, IFNULL(issta.num, 0) as ISSTA, IFNULL(issre.num, 0) as ISSRE, IFNULL(icsm.num, 0) as ICSM, 
		IFNULL(other.num, 0) as Other, 
		IFNULL(tse.num, 0) + IFNULL(tosem.num, 0) + IFNULL(icse.num, 0) + IFNULL(fse.num, 0) + 
		IFNULL(ist.num, 0) + IFNULL(jss.num, 0) + IFNULL(stvr.num, 0) + IFNULL(emse.num, 0) +
		IFNULL(ase.num, 0) + IFNULL(issre.num, 0) + IFNULL(issta.num, 0) + IFNULL(icsm.num, 0) +
		IFNULL(other.num, 0) as Sum
from scholar ee
left join (
	select s.institution, count(distinct ll.id) as num from scholar s
		left join list ll on ll.author like concat('%', s.name, '%')
	where ll.abbr = 'TSE' group by institution
) tse on ee.institution = tse.institution
left join (
	select s.institution, count(distinct ll.id) as num from scholar s
		left join list ll on ll.author like concat('%', s.name, '%')
	where ll.abbr = 'TOSEM' group by institution
) tosem on ee.institution = tosem.institution
left join (
	select s.institution, count(distinct ll.id) as num from scholar s
		left join list ll on ll.author like concat('%', s.name, '%')
	where ll.abbr = 'ICSE' group by institution
) icse on ee.institution = icse.institution
left join (
	select s.institution, count(distinct ll.id) as num from scholar s
		left join list ll on ll.author like concat('%', s.name, '%')
	where ll.abbr = 'FSE' group by institution
) fse on ee.institution = fse.institution
left join (
	select s.institution, count(distinct ll.id) as num from scholar s
		left join list ll on ll.author like concat('%', s.name, '%')
	where ll.abbr = 'IST' group by institution
) ist on ee.institution = ist.institution
left join (
	select s.institution, count(distinct ll.id) as num from scholar s
		left join list ll on ll.author like concat('%', s.name, '%')
	where ll.abbr = 'JSS' group by institution
) jss on ee.institution = jss.institution
left join (
	select s.institution, count(distinct ll.id) as num from scholar s
		left join list ll on ll.author like concat('%', s.name, '%')
	where ll.abbr = 'STVR' group by institution
) stvr on ee.institution = stvr.institution
left join (
	select s.institution, count(distinct ll.id) as num from scholar s
		left join list ll on ll.author like concat('%', s.name, '%')
	where ll.abbr = 'EMSE' group by institution
) emse on ee.institution = emse.institution
left join (
	select s.institution, count(distinct ll.id) as num from scholar s
		left join list ll on ll.author like concat('%', s.name, '%')
	where ll.abbr = 'ASE' group by institution
) ase on ee.institution = ase.institution
left join (
	select s.institution, count(distinct ll.id) as num from scholar s
		left join list ll on ll.author like concat('%', s.name, '%')
	where ll.abbr = 'ISSRE' group by institution
) issre on ee.institution = issre.institution
left join (
	select s.institution, count(distinct ll.id) as num from scholar s
		left join list ll on ll.author like concat('%', s.name, '%')
	where ll.abbr = 'ISSTA' group by institution
) issta on ee.institution = issta.institution
left join (
	select s.institution, count(distinct ll.id) as num from scholar s
		left join list ll on ll.author like concat('%', s.name, '%')
	where ll.abbr = 'ICSM' group by institution
) icsm on ee.institution = icsm.institution
left join (
	select s.institution, count(distinct tp.id) as num from scholar s
		left join list tp on tp.author like concat('%', s.name, '%')
	where (tp.abbr <> "TSE" and tp.abbr <> "TOSEM" and tp.abbr <> "ICSE" and
		   tp.abbr <> "FSE" and tp.abbr <> "IST" and tp.abbr <> "JSS" and tp.abbr <> "EMSE" and 
		   tp.abbr <> "STVR" and tp.abbr <> "ASE" and tp.abbr <> "ISSRE" and tp.abbr <> "ICSM" and 
		   tp.abbr <> "ISSTA" or isnull(tp.abbr)) group by institution
) other on ee.institution = other.institution;