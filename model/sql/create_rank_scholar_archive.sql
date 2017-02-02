drop table rank_author_archive;
create table rank_author_archive AS
select `a`.`name` AS `name`,
    (select count(0) from `list` `b` where ((`b`.`author` like concat('%', `a`.`name`, '%')) and (`b`.`abbr` = 'tse'))) AS `TSE`,
    (select count(0) from `list` `b` where ((`b`.`author` like concat('%', `a`.`name`, '%')) and (`b`.`abbr` = 'tosem'))) AS `TOSEM`,
    (select count(0) from `list` `b` where ((`b`.`author` like concat('%', `a`.`name`, '%')) and (`b`.`abbr` = 'ist'))) AS `IST`,
    (select count(0) from `list` `b` where ((`b`.`author` like concat('%', `a`.`name`, '%')) and (`b`.`abbr` = 'jss'))) AS `JSS`,
    (select count(0) from `list` `b` where ((`b`.`author` like concat('%', `a`.`name`, '%')) and (`b`.`abbr` = 'stvr'))) AS `STVR`,
    (select count(0) from `list` `b` where ((`b`.`author` like concat('%', `a`.`name`, '%')) and (`b`.`abbr` = 'emse'))) AS `EMSE`,
    (select count(0) from `list` `b` where ((`b`.`author` like concat('%', `a`.`name`, '%')) and (`b`.`abbr` = 'fse'))) AS `FSE`,
    (select count(0) from `list` `b` where ((`b`.`author` like concat('%', `a`.`name`, '%')) and (`b`.`abbr` = 'icse'))) AS `ICSE`,
    (select count(0) from `list` `b` where ((`b`.`author` like concat('%', `a`.`name`, '%')) and (`b`.`abbr` = 'ase'))) AS `ASE`,
    (select count(0) from `list` `b` where ((`b`.`author` like concat('%', `a`.`name`, '%')) and (`b`.`abbr` = 'issre'))) AS `ISSRE`,
    (select count(0) from `list` `b` where ((`b`.`author` like concat('%', `a`.`name`, '%')) and (`b`.`abbr` = 'issta'))) AS `ISSTA`,
    (select count(0) from `list` `b` where ((`b`.`author` like concat('%', `a`.`name`, '%')) and (`b`.`abbr` = 'icsm'))) AS `ICSM`,
    (select count(0) from `list` `b` where 
        ((`b`.`author` like concat('%', `a`.`name`, '%'))
            and (((`b`.`abbr` <> 'tse')
            and (`b`.`abbr` <> 'tosem')
            and (`b`.`abbr` <> 'ist')
            and (`b`.`abbr` <> 'jss')
            and (`b`.`abbr` <> 'stvr')
            and (`b`.`abbr` <> 'emse')
            and (`b`.`abbr` <> 'fse')
            and (`b`.`abbr` <> 'icse')
            and (`b`.`abbr` <> 'ase')
            and (`b`.`abbr` <> 'issre')
            and (`b`.`abbr` <> 'issta')
            and (`b`.`abbr` <> 'icsm')
            or isnull(`b`.`abbr`))))) AS `Other`,
    (select count(0) from `list` `b` where (`b`.`author` like concat('%', `a`.`name`, '%'))) AS `Sum`
from `scholar` `a` group by `a`.`name` order by `Sum` desc;
