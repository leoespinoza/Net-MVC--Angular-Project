USE [master]
GO
/****** Object:  Database [Dashboard]    Script Date: 11/27/2017 9:40:24 AM ******/
CREATE DATABASE [Dashboard]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'Dashboard', FILENAME = N'C:\Program Files (x86)\Microsoft SQL Server\MSSQL12.SQLEXPRESS\MSSQL\DATA\Dashboard.mdf' , SIZE = 4096KB , MAXSIZE = UNLIMITED, FILEGROWTH = 1024KB )
 LOG ON 
( NAME = N'Dashboard_log', FILENAME = N'C:\Program Files (x86)\Microsoft SQL Server\MSSQL12.SQLEXPRESS\MSSQL\DATA\Dashboard_log.ldf' , SIZE = 1024KB , MAXSIZE = 2048GB , FILEGROWTH = 10%)
GO
ALTER DATABASE [Dashboard] SET COMPATIBILITY_LEVEL = 120
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [Dashboard].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [Dashboard] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [Dashboard] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [Dashboard] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [Dashboard] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [Dashboard] SET ARITHABORT OFF 
GO
ALTER DATABASE [Dashboard] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [Dashboard] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [Dashboard] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [Dashboard] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [Dashboard] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [Dashboard] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [Dashboard] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [Dashboard] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [Dashboard] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [Dashboard] SET  DISABLE_BROKER 
GO
ALTER DATABASE [Dashboard] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [Dashboard] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [Dashboard] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [Dashboard] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [Dashboard] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [Dashboard] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [Dashboard] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [Dashboard] SET RECOVERY SIMPLE 
GO
ALTER DATABASE [Dashboard] SET  MULTI_USER 
GO
ALTER DATABASE [Dashboard] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [Dashboard] SET DB_CHAINING OFF 
GO
ALTER DATABASE [Dashboard] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [Dashboard] SET TARGET_RECOVERY_TIME = 0 SECONDS 
GO
ALTER DATABASE [Dashboard] SET DELAYED_DURABILITY = DISABLED 
GO
USE [Dashboard]
GO
/****** Object:  Table [dbo].[Customer]    Script Date: 11/27/2017 9:40:24 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Customer](
	[CustomerId] [int] IDENTITY(1,1) NOT NULL,
	[LastName] [nvarchar](50) NULL,
	[FirstName] [nvarchar](50) NULL,
	[Street] [nvarchar](50) NULL,
	[City] [nvarchar](50) NULL,
	[State] [nvarchar](50) NULL,
	[PostalCode] [nvarchar](50) NULL,
	[Country] [nvarchar](50) NULL,
	[Phone] [nvarchar](50) NULL,
 CONSTRAINT [PK_Customer] PRIMARY KEY CLUSTERED 
(
	[CustomerId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[DashboardLayout]    Script Date: 11/27/2017 9:40:24 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[DashboardLayout](
	[DashboardId] [int] IDENTITY(1,1) NOT NULL,
	[DashboardName] [nvarchar](100) NULL,
	[Username] [nvarchar](100) NULL,
	[Priority] [int] NULL,
 CONSTRAINT [PK_DashboardLayout] PRIMARY KEY CLUSTERED 
(
	[DashboardId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[DashboardLayoutTile]    Script Date: 11/27/2017 9:40:24 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[DashboardLayoutTile](
	[DashboardId] [int] NOT NULL,
	[Sequence] [int] NOT NULL,
 CONSTRAINT [PK_DashboardLayoutTile] PRIMARY KEY CLUSTERED 
(
	[DashboardId] ASC,
	[Sequence] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[DashboardLayoutTileProperty]    Script Date: 11/27/2017 9:40:24 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[DashboardLayoutTileProperty](
	[DashboardId] [int] NOT NULL,
	[Sequence] [int] NOT NULL,
	[PropertyName] [nvarchar](100) NOT NULL,
	[PropertyValue] [nvarchar](max) NULL,
 CONSTRAINT [PK_DashboardLayoutTileProperty] PRIMARY KEY CLUSTERED 
(
	[DashboardId] ASC,
	[Sequence] ASC,
	[PropertyName] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [dbo].[DashboardQuery]    Script Date: 11/27/2017 9:40:24 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[DashboardQuery](
	[Name] [nvarchar](50) NOT NULL,
	[ValueType] [nvarchar](50) NULL,
	[Query] [nvarchar](max) NULL,
	[Role] [nvarchar](10) NULL,
 CONSTRAINT [PK_DashboardQuery] PRIMARY KEY CLUSTERED 
(
	[Name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [dbo].[DashboardTile]    Script Date: 11/27/2017 9:40:24 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[DashboardTile](
	[TileType] [nvarchar](50) NOT NULL,
	[TileName] [nvarchar](100) NULL,
	[PropertyNames] [nvarchar](200) NULL,
	[ValueType] [nvarchar](50) NULL,
 CONSTRAINT [PK_DashboardTile] PRIMARY KEY CLUSTERED 
(
	[TileType] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Employee]    Script Date: 11/27/2017 9:40:24 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Employee](
	[EmployeeId] [int] IDENTITY(1,1) NOT NULL,
	[LastName] [nvarchar](50) NULL,
	[FirstName] [nvarchar](50) NULL,
	[Title] [nvarchar](50) NULL,
	[StartDate] [date] NULL,
	[IsActive] [bit] NULL,
	[ManagerEmployeeId] [int] NULL,
	[TermDate] [date] NULL,
	[Username] [nvarchar](100) NULL,
 CONSTRAINT [PK_Employee] PRIMARY KEY CLUSTERED 
(
	[EmployeeId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Order]    Script Date: 11/27/2017 9:40:24 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Order](
	[OrderId] [int] IDENTITY(1,1) NOT NULL,
	[StoreId] [int] NULL,
	[CustomerId] [int] NULL,
	[OrderDate] [date] NULL,
	[Subtotal] [decimal](10, 2) NULL,
	[Tax] [decimal](10, 2) NULL,
	[Total] [decimal](10, 2) NULL,
	[IsOpen] [bit] NULL,
	[ShipDate] [date] NULL,
	[SalesPersonEmployeeId] [int] NULL,
 CONSTRAINT [PK_Order] PRIMARY KEY CLUSTERED 
(
	[OrderId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Review]    Script Date: 11/27/2017 9:40:24 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Review](
	[ReviewId] [int] IDENTITY(1,1) NOT NULL,
	[Date] [date] NULL,
	[CustomerId] [int] NULL,
	[StoreId] [int] NULL,
	[Stars] [int] NULL,
	[Comments] [nvarchar](max) NULL,
 CONSTRAINT [PK_Review] PRIMARY KEY CLUSTERED 
(
	[ReviewId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Store]    Script Date: 11/27/2017 9:40:24 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Store](
	[StoreId] [int] IDENTITY(1,1) NOT NULL,
	[StoreName] [nvarchar](50) NULL,
	[ManagerEmployeeId] [int] NULL,
	[Street] [nvarchar](50) NULL,
	[City] [nvarchar](50) NULL,
	[State] [nvarchar](50) NULL,
	[PostalCode] [nvarchar](10) NULL,
	[Country] [nvarchar](50) NULL,
	[Phone] [nvarchar](50) NULL,
 CONSTRAINT [PK_Store] PRIMARY KEY CLUSTERED 
(
	[StoreId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET IDENTITY_INSERT [dbo].[Customer] ON 

GO
INSERT [dbo].[Customer] ([CustomerId], [LastName], [FirstName], [Street], [City], [State], [PostalCode], [Country], [Phone]) VALUES (101, N'Andrews', N'Abraham', N'801 N State College Blvd', N'Fullerton', N'CA', N'92831', N'USA', N'714 555-9151')
GO
INSERT [dbo].[Customer] ([CustomerId], [LastName], [FirstName], [Street], [City], [State], [PostalCode], [Country], [Phone]) VALUES (102, N'Benson', N'Belle', N'15615 Whitwood Lane', N'Whittier', N'CA', N'90603', N'USA', N'949 555-9023')
GO
INSERT [dbo].[Customer] ([CustomerId], [LastName], [FirstName], [Street], [City], [State], [PostalCode], [Country], [Phone]) VALUES (103, N'Cooper', N'Chris', N'856 Birch St', N'Brea', N'CA', N'92821', N'USA', N'714 555-5768')
GO
INSERT [dbo].[Customer] ([CustomerId], [LastName], [FirstName], [Street], [City], [State], [PostalCode], [Country], [Phone]) VALUES (104, N'Deluca', N'Dina', N'27953 Hillcrest', N'Mission Viejo', N'CA', N'92692', N'USA', N'949 555-2341')
GO
INSERT [dbo].[Customer] ([CustomerId], [LastName], [FirstName], [Street], [City], [State], [PostalCode], [Country], [Phone]) VALUES (105, N'Elling', N'Edith', N'81 Manhatten Blvd', N'Central Islip', N'NY', N'11760', N'USA', N'516 555-8797')
GO
INSERT [dbo].[Customer] ([CustomerId], [LastName], [FirstName], [Street], [City], [State], [PostalCode], [Country], [Phone]) VALUES (106, N'Flanagan', N'Faye', N'367 Wildwood Rd', N'Ronkonkoma', N'NY', N'11779', N'USA', N'516 555-4345')
GO
INSERT [dbo].[Customer] ([CustomerId], [LastName], [FirstName], [Street], [City], [State], [PostalCode], [Country], [Phone]) VALUES (107, N'Gurney', N'Glen', N'2 Vine Haven', N'Commack', N'NY', N'11725', N'USA', N'714 555-5768')
GO
INSERT [dbo].[Customer] ([CustomerId], [LastName], [FirstName], [Street], [City], [State], [PostalCode], [Country], [Phone]) VALUES (108, N'Harvey', N'Helen', N'138 Lenox Ave', N'Bellport', N'NY', N'11713', N'USA', N'516 555-1413')
GO
INSERT [dbo].[Customer] ([CustomerId], [LastName], [FirstName], [Street], [City], [State], [PostalCode], [Country], [Phone]) VALUES (109, N'Ingalls', N'Irma', N'1145 State St', N'Wantagh', N'NY', N'11793', N'USA', N'714 555-2001')
GO
INSERT [dbo].[Customer] ([CustomerId], [LastName], [FirstName], [Street], [City], [State], [PostalCode], [Country], [Phone]) VALUES (110, N'Jurgens', N'Jim', N'21 Grand Ave', N'Farmingdale', N'NY', N'11735', N'USA', N'516 555-7723')
GO
INSERT [dbo].[Customer] ([CustomerId], [LastName], [FirstName], [Street], [City], [State], [PostalCode], [Country], [Phone]) VALUES (111, N'Korrigan', N'Kelly', N'300 W Main St', N'Babylon', N'NY', N'11701', N'USA', N'631 420-0754')
GO
INSERT [dbo].[Customer] ([CustomerId], [LastName], [FirstName], [Street], [City], [State], [PostalCode], [Country], [Phone]) VALUES (112, N'Lawman', N'Larry', N'30 Lakewood Rd', N'Ronkonkoma', N'NY', N'11779', N'USA', N'631 555-9299')
GO
INSERT [dbo].[Customer] ([CustomerId], [LastName], [FirstName], [Street], [City], [State], [PostalCode], [Country], [Phone]) VALUES (113, N'Marple', N'Mary', N'401 New York Ave', N'Huntington', N'NY', N'11721', N'USA', N'516 555-0428')
GO
SET IDENTITY_INSERT [dbo].[Customer] OFF
GO
SET IDENTITY_INSERT [dbo].[DashboardLayout] ON 

GO
INSERT [dbo].[DashboardLayout] ([DashboardId], [DashboardName], [Username], [Priority]) VALUES (359, N'Home', N'default', 1)
GO
SET IDENTITY_INSERT [dbo].[DashboardLayout] OFF
GO
INSERT [dbo].[DashboardLayoutTile] ([DashboardId], [Sequence]) VALUES (359, 1)
GO
INSERT [dbo].[DashboardLayoutTile] ([DashboardId], [Sequence]) VALUES (359, 2)
GO
INSERT [dbo].[DashboardLayoutTile] ([DashboardId], [Sequence]) VALUES (359, 3)
GO
INSERT [dbo].[DashboardLayoutTile] ([DashboardId], [Sequence]) VALUES (359, 4)
GO
INSERT [dbo].[DashboardLayoutTile] ([DashboardId], [Sequence]) VALUES (359, 5)
GO
INSERT [dbo].[DashboardLayoutTile] ([DashboardId], [Sequence]) VALUES (359, 6)
GO
INSERT [dbo].[DashboardLayoutTile] ([DashboardId], [Sequence]) VALUES (359, 7)
GO
INSERT [dbo].[DashboardLayoutTile] ([DashboardId], [Sequence]) VALUES (359, 8)
GO
INSERT [dbo].[DashboardLayoutTile] ([DashboardId], [Sequence]) VALUES (359, 9)
GO
INSERT [dbo].[DashboardLayoutTileProperty] ([DashboardId], [Sequence], [PropertyName], [PropertyValue]) VALUES (359, 1, N'color', N'#E60017')
GO
INSERT [dbo].[DashboardLayoutTileProperty] ([DashboardId], [Sequence], [PropertyName], [PropertyValue]) VALUES (359, 1, N'columns', NULL)
GO
INSERT [dbo].[DashboardLayoutTileProperty] ([DashboardId], [Sequence], [PropertyName], [PropertyValue]) VALUES (359, 1, N'dataSource', N'Customer Count')
GO
INSERT [dbo].[DashboardLayoutTileProperty] ([DashboardId], [Sequence], [PropertyName], [PropertyValue]) VALUES (359, 1, N'height', N'1')
GO
INSERT [dbo].[DashboardLayoutTileProperty] ([DashboardId], [Sequence], [PropertyName], [PropertyValue]) VALUES (359, 1, N'label', N'Customers')
GO
INSERT [dbo].[DashboardLayoutTileProperty] ([DashboardId], [Sequence], [PropertyName], [PropertyValue]) VALUES (359, 1, N'link', N'/App/Customers')
GO
INSERT [dbo].[DashboardLayoutTileProperty] ([DashboardId], [Sequence], [PropertyName], [PropertyValue]) VALUES (359, 1, N'role', N'Employee')
GO
INSERT [dbo].[DashboardLayoutTileProperty] ([DashboardId], [Sequence], [PropertyName], [PropertyValue]) VALUES (359, 1, N'title', N'Customers')
GO
INSERT [dbo].[DashboardLayoutTileProperty] ([DashboardId], [Sequence], [PropertyName], [PropertyValue]) VALUES (359, 1, N'type', N'counter')
GO
INSERT [dbo].[DashboardLayoutTileProperty] ([DashboardId], [Sequence], [PropertyName], [PropertyValue]) VALUES (359, 1, N'width', N'1')
GO
INSERT [dbo].[DashboardLayoutTileProperty] ([DashboardId], [Sequence], [PropertyName], [PropertyValue]) VALUES (359, 2, N'color', N'#fbbc3d')
GO
INSERT [dbo].[DashboardLayoutTileProperty] ([DashboardId], [Sequence], [PropertyName], [PropertyValue]) VALUES (359, 2, N'columns', N'null')
GO
INSERT [dbo].[DashboardLayoutTileProperty] ([DashboardId], [Sequence], [PropertyName], [PropertyValue]) VALUES (359, 2, N'dataSource', N'Order Count')
GO
INSERT [dbo].[DashboardLayoutTileProperty] ([DashboardId], [Sequence], [PropertyName], [PropertyValue]) VALUES (359, 2, N'height', N'1')
GO
INSERT [dbo].[DashboardLayoutTileProperty] ([DashboardId], [Sequence], [PropertyName], [PropertyValue]) VALUES (359, 2, N'label', N'Active Orders')
GO
INSERT [dbo].[DashboardLayoutTileProperty] ([DashboardId], [Sequence], [PropertyName], [PropertyValue]) VALUES (359, 2, N'link', N'/App/Customers')
GO
INSERT [dbo].[DashboardLayoutTileProperty] ([DashboardId], [Sequence], [PropertyName], [PropertyValue]) VALUES (359, 2, N'role', N'Employee')
GO
INSERT [dbo].[DashboardLayoutTileProperty] ([DashboardId], [Sequence], [PropertyName], [PropertyValue]) VALUES (359, 2, N'title', N'Orders')
GO
INSERT [dbo].[DashboardLayoutTileProperty] ([DashboardId], [Sequence], [PropertyName], [PropertyValue]) VALUES (359, 2, N'type', N'counter')
GO
INSERT [dbo].[DashboardLayoutTileProperty] ([DashboardId], [Sequence], [PropertyName], [PropertyValue]) VALUES (359, 2, N'width', N'1')
GO
INSERT [dbo].[DashboardLayoutTileProperty] ([DashboardId], [Sequence], [PropertyName], [PropertyValue]) VALUES (359, 3, N'color', N'#a7d050')
GO
INSERT [dbo].[DashboardLayoutTileProperty] ([DashboardId], [Sequence], [PropertyName], [PropertyValue]) VALUES (359, 3, N'columns', N'null')
GO
INSERT [dbo].[DashboardLayoutTileProperty] ([DashboardId], [Sequence], [PropertyName], [PropertyValue]) VALUES (359, 3, N'dataSource', N'Order Count (My Orders)')
GO
INSERT [dbo].[DashboardLayoutTileProperty] ([DashboardId], [Sequence], [PropertyName], [PropertyValue]) VALUES (359, 3, N'height', N'1')
GO
INSERT [dbo].[DashboardLayoutTileProperty] ([DashboardId], [Sequence], [PropertyName], [PropertyValue]) VALUES (359, 3, N'label', N'orders')
GO
INSERT [dbo].[DashboardLayoutTileProperty] ([DashboardId], [Sequence], [PropertyName], [PropertyValue]) VALUES (359, 3, N'link', NULL)
GO
INSERT [dbo].[DashboardLayoutTileProperty] ([DashboardId], [Sequence], [PropertyName], [PropertyValue]) VALUES (359, 3, N'role', N'Sales')
GO
INSERT [dbo].[DashboardLayoutTileProperty] ([DashboardId], [Sequence], [PropertyName], [PropertyValue]) VALUES (359, 3, N'title', N'My Orders')
GO
INSERT [dbo].[DashboardLayoutTileProperty] ([DashboardId], [Sequence], [PropertyName], [PropertyValue]) VALUES (359, 3, N'type', N'counter')
GO
INSERT [dbo].[DashboardLayoutTileProperty] ([DashboardId], [Sequence], [PropertyName], [PropertyValue]) VALUES (359, 3, N'width', N'1')
GO
INSERT [dbo].[DashboardLayoutTileProperty] ([DashboardId], [Sequence], [PropertyName], [PropertyValue]) VALUES (359, 4, N'color', N'#7f1725')
GO
INSERT [dbo].[DashboardLayoutTileProperty] ([DashboardId], [Sequence], [PropertyName], [PropertyValue]) VALUES (359, 4, N'columns', N'["0 STARS","1.5","3","5 STARS"]')
GO
INSERT [dbo].[DashboardLayoutTileProperty] ([DashboardId], [Sequence], [PropertyName], [PropertyValue]) VALUES (359, 4, N'dataSource', N'Customer Satisfaction')
GO
INSERT [dbo].[DashboardLayoutTileProperty] ([DashboardId], [Sequence], [PropertyName], [PropertyValue]) VALUES (359, 4, N'height', N'1')
GO
INSERT [dbo].[DashboardLayoutTileProperty] ([DashboardId], [Sequence], [PropertyName], [PropertyValue]) VALUES (359, 4, N'label', N'4.5')
GO
INSERT [dbo].[DashboardLayoutTileProperty] ([DashboardId], [Sequence], [PropertyName], [PropertyValue]) VALUES (359, 4, N'link', NULL)
GO
INSERT [dbo].[DashboardLayoutTileProperty] ([DashboardId], [Sequence], [PropertyName], [PropertyValue]) VALUES (359, 4, N'role', N'Employee')
GO
INSERT [dbo].[DashboardLayoutTileProperty] ([DashboardId], [Sequence], [PropertyName], [PropertyValue]) VALUES (359, 4, N'title', N'Customer Satisfaction')
GO
INSERT [dbo].[DashboardLayoutTileProperty] ([DashboardId], [Sequence], [PropertyName], [PropertyValue]) VALUES (359, 4, N'type', N'kpi')
GO
INSERT [dbo].[DashboardLayoutTileProperty] ([DashboardId], [Sequence], [PropertyName], [PropertyValue]) VALUES (359, 4, N'width', N'2')
GO
INSERT [dbo].[DashboardLayoutTileProperty] ([DashboardId], [Sequence], [PropertyName], [PropertyValue]) VALUES (359, 5, N'color', N'#b784ab')
GO
INSERT [dbo].[DashboardLayoutTileProperty] ([DashboardId], [Sequence], [PropertyName], [PropertyValue]) VALUES (359, 5, N'columns', N'[["EmployeeId","number"],["LastName","string"],["FirstName","string"],["Title","string"]]')
GO
INSERT [dbo].[DashboardLayoutTileProperty] ([DashboardId], [Sequence], [PropertyName], [PropertyValue]) VALUES (359, 5, N'dataSource', N'Employees (My Direct Reports)')
GO
INSERT [dbo].[DashboardLayoutTileProperty] ([DashboardId], [Sequence], [PropertyName], [PropertyValue]) VALUES (359, 5, N'height', N'1')
GO
INSERT [dbo].[DashboardLayoutTileProperty] ([DashboardId], [Sequence], [PropertyName], [PropertyValue]) VALUES (359, 5, N'label', N'label')
GO
INSERT [dbo].[DashboardLayoutTileProperty] ([DashboardId], [Sequence], [PropertyName], [PropertyValue]) VALUES (359, 5, N'link', NULL)
GO
INSERT [dbo].[DashboardLayoutTileProperty] ([DashboardId], [Sequence], [PropertyName], [PropertyValue]) VALUES (359, 5, N'role', N'Manager')
GO
INSERT [dbo].[DashboardLayoutTileProperty] ([DashboardId], [Sequence], [PropertyName], [PropertyValue]) VALUES (359, 5, N'title', N'My Direct Reports')
GO
INSERT [dbo].[DashboardLayoutTileProperty] ([DashboardId], [Sequence], [PropertyName], [PropertyValue]) VALUES (359, 5, N'type', N'table')
GO
INSERT [dbo].[DashboardLayoutTileProperty] ([DashboardId], [Sequence], [PropertyName], [PropertyValue]) VALUES (359, 5, N'width', N'2')
GO
INSERT [dbo].[DashboardLayoutTileProperty] ([DashboardId], [Sequence], [PropertyName], [PropertyValue]) VALUES (359, 6, N'color', N'#3476c9')
GO
INSERT [dbo].[DashboardLayoutTileProperty] ([DashboardId], [Sequence], [PropertyName], [PropertyValue]) VALUES (359, 6, N'columns', N'null')
GO
INSERT [dbo].[DashboardLayoutTileProperty] ([DashboardId], [Sequence], [PropertyName], [PropertyValue]) VALUES (359, 6, N'dataSource', N'Orders (My Orders)')
GO
INSERT [dbo].[DashboardLayoutTileProperty] ([DashboardId], [Sequence], [PropertyName], [PropertyValue]) VALUES (359, 6, N'height', N'1')
GO
INSERT [dbo].[DashboardLayoutTileProperty] ([DashboardId], [Sequence], [PropertyName], [PropertyValue]) VALUES (359, 6, N'label', N'label')
GO
INSERT [dbo].[DashboardLayoutTileProperty] ([DashboardId], [Sequence], [PropertyName], [PropertyValue]) VALUES (359, 6, N'link', NULL)
GO
INSERT [dbo].[DashboardLayoutTileProperty] ([DashboardId], [Sequence], [PropertyName], [PropertyValue]) VALUES (359, 6, N'role', N'Sales')
GO
INSERT [dbo].[DashboardLayoutTileProperty] ([DashboardId], [Sequence], [PropertyName], [PropertyValue]) VALUES (359, 6, N'title', N'My Open Orders')
GO
INSERT [dbo].[DashboardLayoutTileProperty] ([DashboardId], [Sequence], [PropertyName], [PropertyValue]) VALUES (359, 6, N'type', N'table')
GO
INSERT [dbo].[DashboardLayoutTileProperty] ([DashboardId], [Sequence], [PropertyName], [PropertyValue]) VALUES (359, 6, N'width', N'2')
GO
INSERT [dbo].[DashboardLayoutTileProperty] ([DashboardId], [Sequence], [PropertyName], [PropertyValue]) VALUES (359, 7, N'color', N'#a07c17')
GO
INSERT [dbo].[DashboardLayoutTileProperty] ([DashboardId], [Sequence], [PropertyName], [PropertyValue]) VALUES (359, 7, N'columns', N'[["OrderId","number"],["StoreId","number"],["CustId","number"],["OrderDate","string"],["Total","number"],["IsOpen","boolean"],["ShipDate","string"]]')
GO
INSERT [dbo].[DashboardLayoutTileProperty] ([DashboardId], [Sequence], [PropertyName], [PropertyValue]) VALUES (359, 7, N'dataSource', N'Orders')
GO
INSERT [dbo].[DashboardLayoutTileProperty] ([DashboardId], [Sequence], [PropertyName], [PropertyValue]) VALUES (359, 7, N'height', N'2')
GO
INSERT [dbo].[DashboardLayoutTileProperty] ([DashboardId], [Sequence], [PropertyName], [PropertyValue]) VALUES (359, 7, N'label', NULL)
GO
INSERT [dbo].[DashboardLayoutTileProperty] ([DashboardId], [Sequence], [PropertyName], [PropertyValue]) VALUES (359, 7, N'link', N'/App/Orders')
GO
INSERT [dbo].[DashboardLayoutTileProperty] ([DashboardId], [Sequence], [PropertyName], [PropertyValue]) VALUES (359, 7, N'role', N'Employee')
GO
INSERT [dbo].[DashboardLayoutTileProperty] ([DashboardId], [Sequence], [PropertyName], [PropertyValue]) VALUES (359, 7, N'title', N'Orders')
GO
INSERT [dbo].[DashboardLayoutTileProperty] ([DashboardId], [Sequence], [PropertyName], [PropertyValue]) VALUES (359, 7, N'type', N'table')
GO
INSERT [dbo].[DashboardLayoutTileProperty] ([DashboardId], [Sequence], [PropertyName], [PropertyValue]) VALUES (359, 7, N'width', N'2')
GO
INSERT [dbo].[DashboardLayoutTileProperty] ([DashboardId], [Sequence], [PropertyName], [PropertyValue]) VALUES (359, 8, N'color', N'#339947')
GO
INSERT [dbo].[DashboardLayoutTileProperty] ([DashboardId], [Sequence], [PropertyName], [PropertyValue]) VALUES (359, 8, N'columns', N'["Bayport","Bethpage","Fountain Valley","Irvine","Lake Forest","Tustin"]')
GO
INSERT [dbo].[DashboardLayoutTileProperty] ([DashboardId], [Sequence], [PropertyName], [PropertyValue]) VALUES (359, 8, N'dataSource', N'Revenue by Store')
GO
INSERT [dbo].[DashboardLayoutTileProperty] ([DashboardId], [Sequence], [PropertyName], [PropertyValue]) VALUES (359, 8, N'height', N'1')
GO
INSERT [dbo].[DashboardLayoutTileProperty] ([DashboardId], [Sequence], [PropertyName], [PropertyValue]) VALUES (359, 8, N'label', NULL)
GO
INSERT [dbo].[DashboardLayoutTileProperty] ([DashboardId], [Sequence], [PropertyName], [PropertyValue]) VALUES (359, 8, N'link', N'/App/Stores')
GO
INSERT [dbo].[DashboardLayoutTileProperty] ([DashboardId], [Sequence], [PropertyName], [PropertyValue]) VALUES (359, 8, N'role', N'Sales')
GO
INSERT [dbo].[DashboardLayoutTileProperty] ([DashboardId], [Sequence], [PropertyName], [PropertyValue]) VALUES (359, 8, N'title', N'Revenue Share by Store')
GO
INSERT [dbo].[DashboardLayoutTileProperty] ([DashboardId], [Sequence], [PropertyName], [PropertyValue]) VALUES (359, 8, N'type', N'pie')
GO
INSERT [dbo].[DashboardLayoutTileProperty] ([DashboardId], [Sequence], [PropertyName], [PropertyValue]) VALUES (359, 8, N'width', N'2')
GO
INSERT [dbo].[DashboardLayoutTileProperty] ([DashboardId], [Sequence], [PropertyName], [PropertyValue]) VALUES (359, 9, N'color', N'#009CCC')
GO
INSERT [dbo].[DashboardLayoutTileProperty] ([DashboardId], [Sequence], [PropertyName], [PropertyValue]) VALUES (359, 9, N'columns', N'["Bayport","Bethpage","Fountain Valley","Irvine","Lake Forest","Tustin"]')
GO
INSERT [dbo].[DashboardLayoutTileProperty] ([DashboardId], [Sequence], [PropertyName], [PropertyValue]) VALUES (359, 9, N'dataSource', N'Revenue by Store')
GO
INSERT [dbo].[DashboardLayoutTileProperty] ([DashboardId], [Sequence], [PropertyName], [PropertyValue]) VALUES (359, 9, N'height', N'2')
GO
INSERT [dbo].[DashboardLayoutTileProperty] ([DashboardId], [Sequence], [PropertyName], [PropertyValue]) VALUES (359, 9, N'label', NULL)
GO
INSERT [dbo].[DashboardLayoutTileProperty] ([DashboardId], [Sequence], [PropertyName], [PropertyValue]) VALUES (359, 9, N'link', N'/App/Stores')
GO
INSERT [dbo].[DashboardLayoutTileProperty] ([DashboardId], [Sequence], [PropertyName], [PropertyValue]) VALUES (359, 9, N'role', N'Sales')
GO
INSERT [dbo].[DashboardLayoutTileProperty] ([DashboardId], [Sequence], [PropertyName], [PropertyValue]) VALUES (359, 9, N'title', N'Revenue by Store')
GO
INSERT [dbo].[DashboardLayoutTileProperty] ([DashboardId], [Sequence], [PropertyName], [PropertyValue]) VALUES (359, 9, N'type', N'bar')
GO
INSERT [dbo].[DashboardLayoutTileProperty] ([DashboardId], [Sequence], [PropertyName], [PropertyValue]) VALUES (359, 9, N'width', N'2')
GO
INSERT [dbo].[DashboardQuery] ([Name], [ValueType], [Query], [Role]) VALUES (N'Customer Count', N'number', N'SELECT COUNT(*) FROM Customer', NULL)
GO
INSERT [dbo].[DashboardQuery] ([Name], [ValueType], [Query], [Role]) VALUES (N'Customer Satisfaction', N'kpi-set', N'SELECT ROUND(100*(AVG(CAST(Stars AS FLOAT))/5), 0) AS Value, AVG(CAST(Stars AS FLOAT))  AS Label , ''0 STARS'', ''1.5'', ''3'', ''5 STARS'' from review', NULL)
GO
INSERT [dbo].[DashboardQuery] ([Name], [ValueType], [Query], [Role]) VALUES (N'Customers', N'table', N'SELECT * FROM Customer', NULL)
GO
INSERT [dbo].[DashboardQuery] ([Name], [ValueType], [Query], [Role]) VALUES (N'Customers with Open Orders', N'table', N'SELECT Customer.* FROM Customer INNER JOIN [Order] ord ON ord.CustomerId=Customer.CustomerId AND ord.IsOpen=1', NULL)
GO
INSERT [dbo].[DashboardQuery] ([Name], [ValueType], [Query], [Role]) VALUES (N'Employees (My Direct Reports)', N'table', N'SELECT emp.EmployeeId,emp.LastName,emp.FirstName,emp.Title FROM Employee emp INNER JOIN Employee mgr on mgr.EmployeeId=emp.ManagerEmployeeId WHERE mgr.Username=@username', N'Manager')
GO
INSERT [dbo].[DashboardQuery] ([Name], [ValueType], [Query], [Role]) VALUES (N'Open Orders', N'table', N'SELECT * FROM [Order] WHERE IsOpen=1', N'Sales')
GO
INSERT [dbo].[DashboardQuery] ([Name], [ValueType], [Query], [Role]) VALUES (N'Order Amounts', N'number-array', N'SELECT ''Total'', Total FROM [Order]', N'Sales')
GO
INSERT [dbo].[DashboardQuery] ([Name], [ValueType], [Query], [Role]) VALUES (N'Order Count', N'number', N'SELECT COUNT(*) FROM [Order]', NULL)
GO
INSERT [dbo].[DashboardQuery] ([Name], [ValueType], [Query], [Role]) VALUES (N'Order Count (My Orders)', N'number', N'SELECT COUNT(ord.OrderId) FROM [Order] ord INNER JOIN Employee emp ON emp.EmployeeId=ord.SalesPersonEmployeeId AND emp.Username=@username', N'Sales')
GO
INSERT [dbo].[DashboardQuery] ([Name], [ValueType], [Query], [Role]) VALUES (N'Orders', N'table', N'SELECT OrderId,StoreId,CustomerId AS CustId,CONVERT(date, OrderDate) as OrderDate,Total,IsOpen,CONVERT(date, ShipDate) as ShipDate FROM [Order]', NULL)
GO
INSERT [dbo].[DashboardQuery] ([Name], [ValueType], [Query], [Role]) VALUES (N'Orders (My Orders)', N'table', N'SELECT  OrderId,CustomerId,OrderDate,Subtotal,Tax,Total,IsOpen,ShipDate FROM [Order] ord INNER JOIN Employee emp ON emp.EmployeeId=ord.SalesPersonEmployeeId AND emp.Username=@username', N'Sales')
GO
INSERT [dbo].[DashboardQuery] ([Name], [ValueType], [Query], [Role]) VALUES (N'Revenue by Store', N'number-array', N'SELECT store.StoreName, SUM(ord.Total) AS Sales FROM [order] ord INNER JOIN store store ON store.StoreId=ord.StoreId GROUP BY store.StoreName ORDER BY store.StoreName', NULL)
GO
INSERT [dbo].[DashboardTile] ([TileType], [TileName], [PropertyNames], [ValueType]) VALUES (N'bar', N'Bar Chart', N'type|title|width|height|color|dataSource|columns|value', N'number-array')
GO
INSERT [dbo].[DashboardTile] ([TileType], [TileName], [PropertyNames], [ValueType]) VALUES (N'column', N'Column Chart', N'type|title|width|height|color|dataSource|columns|value', N'number-array')
GO
INSERT [dbo].[DashboardTile] ([TileType], [TileName], [PropertyNames], [ValueType]) VALUES (N'counter', N'Counter', N'type|title|width|height|color|dataSource|value|label', N'number')
GO
INSERT [dbo].[DashboardTile] ([TileType], [TileName], [PropertyNames], [ValueType]) VALUES (N'donut', N'Donut Chart', N'type|title|width|height|color|dataSource|columns|value', N'number-array')
GO
INSERT [dbo].[DashboardTile] ([TileType], [TileName], [PropertyNames], [ValueType]) VALUES (N'kpi', N'KPI Chart', N'type|title|width|height|color|dataSource|columns|label|value', N'kpi-set')
GO
INSERT [dbo].[DashboardTile] ([TileType], [TileName], [PropertyNames], [ValueType]) VALUES (N'pie', N'Pie Chart', N'type|title|width|height|color|dataSource|columns|value', N'number-array')
GO
INSERT [dbo].[DashboardTile] ([TileType], [TileName], [PropertyNames], [ValueType]) VALUES (N'table', N'Table', N'type|title|width|height|color|dataSource|columns|value', N'table')
GO
SET IDENTITY_INSERT [dbo].[Employee] ON 

GO
INSERT [dbo].[Employee] ([EmployeeId], [LastName], [FirstName], [Title], [StartDate], [IsActive], [ManagerEmployeeId], [TermDate], [Username]) VALUES (1, N'Adams', N'Alex', N'President', CAST(N'2015-01-01' AS Date), 1, NULL, NULL, N'alex.adams')
GO
INSERT [dbo].[Employee] ([EmployeeId], [LastName], [FirstName], [Title], [StartDate], [IsActive], [ManagerEmployeeId], [TermDate], [Username]) VALUES (2, N'Baker', N'Barbara', N'Controller', CAST(N'2015-01-01' AS Date), 1, 1, NULL, N'barbara.baker')
GO
INSERT [dbo].[Employee] ([EmployeeId], [LastName], [FirstName], [Title], [StartDate], [IsActive], [ManagerEmployeeId], [TermDate], [Username]) VALUES (3, N'Collins', N'Curt', N'VP Sales', CAST(N'2015-01-01' AS Date), 1, 1, NULL, N'curt.collins')
GO
INSERT [dbo].[Employee] ([EmployeeId], [LastName], [FirstName], [Title], [StartDate], [IsActive], [ManagerEmployeeId], [TermDate], [Username]) VALUES (4, N'Daimler', N'Douglas', N'Store Manager', CAST(N'2015-01-01' AS Date), 1, 3, NULL, N'douglas.daimler')
GO
INSERT [dbo].[Employee] ([EmployeeId], [LastName], [FirstName], [Title], [StartDate], [IsActive], [ManagerEmployeeId], [TermDate], [Username]) VALUES (5, N'Enright', N'Edward', N'Store Manager', CAST(N'2015-03-01' AS Date), 1, 3, NULL, N'ed.enright')
GO
INSERT [dbo].[Employee] ([EmployeeId], [LastName], [FirstName], [Title], [StartDate], [IsActive], [ManagerEmployeeId], [TermDate], [Username]) VALUES (6, N'Finch', N'Francis', N'Store Manager', CAST(N'2016-10-01' AS Date), 1, 3, NULL, N'francis.finch')
GO
INSERT [dbo].[Employee] ([EmployeeId], [LastName], [FirstName], [Title], [StartDate], [IsActive], [ManagerEmployeeId], [TermDate], [Username]) VALUES (7, N'Gerrold', N'Gloria', N'Store Manager', CAST(N'2016-01-01' AS Date), 1, 3, NULL, N'gloria.gerrold')
GO
INSERT [dbo].[Employee] ([EmployeeId], [LastName], [FirstName], [Title], [StartDate], [IsActive], [ManagerEmployeeId], [TermDate], [Username]) VALUES (8, N'Downey', N'Stuart', N'Sales Executive', CAST(N'2016-04-12' AS Date), 1, 4, NULL, N'stuart.downey')
GO
INSERT [dbo].[Employee] ([EmployeeId], [LastName], [FirstName], [Title], [StartDate], [IsActive], [ManagerEmployeeId], [TermDate], [Username]) VALUES (9, N'Inchney', N'Ivan', N'Sales Associate', CAST(N'2016-11-15' AS Date), 1, 8, NULL, N'ivan.inchney')
GO
INSERT [dbo].[Employee] ([EmployeeId], [LastName], [FirstName], [Title], [StartDate], [IsActive], [ManagerEmployeeId], [TermDate], [Username]) VALUES (10, N'Jacobson', N'Jerry', N'Sales Associate', CAST(N'2016-11-30' AS Date), 1, 8, NULL, N'jerry.jacobson')
GO
INSERT [dbo].[Employee] ([EmployeeId], [LastName], [FirstName], [Title], [StartDate], [IsActive], [ManagerEmployeeId], [TermDate], [Username]) VALUES (11, N'Brady', N'Marcia', N'Marketing Manager', CAST(N'2016-08-01' AS Date), 1, 1, NULL, N'marcia.brady')
GO
INSERT [dbo].[Employee] ([EmployeeId], [LastName], [FirstName], [Title], [StartDate], [IsActive], [ManagerEmployeeId], [TermDate], [Username]) VALUES (12, N'Kahoutek', N'Kevin', N'Mailroom Associate', CAST(N'2016-11-30' AS Date), 1, 11, NULL, N'kevin.kahoutek')
GO
INSERT [dbo].[Employee] ([EmployeeId], [LastName], [FirstName], [Title], [StartDate], [IsActive], [ManagerEmployeeId], [TermDate], [Username]) VALUES (13, N'Lassiter', N'Linda', N'Receptionist', CAST(N'2016-08-01' AS Date), 1, 11, NULL, N'linda.lassiter')
GO
INSERT [dbo].[Employee] ([EmployeeId], [LastName], [FirstName], [Title], [StartDate], [IsActive], [ManagerEmployeeId], [TermDate], [Username]) VALUES (14, N'Morrison', N'Mark', N'Gardener', CAST(N'2016-10-22' AS Date), 1, 11, NULL, N'mark.morrison')
GO
SET IDENTITY_INSERT [dbo].[Employee] OFF
GO
SET IDENTITY_INSERT [dbo].[Order] ON 

GO
INSERT [dbo].[Order] ([OrderId], [StoreId], [CustomerId], [OrderDate], [Subtotal], [Tax], [Total], [IsOpen], [ShipDate], [SalesPersonEmployeeId]) VALUES (1001, 1, 101, CAST(N'2015-01-30' AS Date), CAST(100.00 AS Decimal(10, 2)), CAST(8.00 AS Decimal(10, 2)), CAST(108.00 AS Decimal(10, 2)), 0, CAST(N'2015-01-31' AS Date), 8)
GO
INSERT [dbo].[Order] ([OrderId], [StoreId], [CustomerId], [OrderDate], [Subtotal], [Tax], [Total], [IsOpen], [ShipDate], [SalesPersonEmployeeId]) VALUES (1002, 2, 102, CAST(N'2015-02-03' AS Date), CAST(200.00 AS Decimal(10, 2)), CAST(16.00 AS Decimal(10, 2)), CAST(216.00 AS Decimal(10, 2)), 0, CAST(N'2015-02-05' AS Date), NULL)
GO
INSERT [dbo].[Order] ([OrderId], [StoreId], [CustomerId], [OrderDate], [Subtotal], [Tax], [Total], [IsOpen], [ShipDate], [SalesPersonEmployeeId]) VALUES (1003, 3, 103, CAST(N'2015-02-24' AS Date), CAST(150.00 AS Decimal(10, 2)), CAST(12.00 AS Decimal(10, 2)), CAST(162.00 AS Decimal(10, 2)), 0, CAST(N'2015-02-24' AS Date), NULL)
GO
INSERT [dbo].[Order] ([OrderId], [StoreId], [CustomerId], [OrderDate], [Subtotal], [Tax], [Total], [IsOpen], [ShipDate], [SalesPersonEmployeeId]) VALUES (1004, 4, 104, CAST(N'2015-03-17' AS Date), CAST(250.00 AS Decimal(10, 2)), CAST(20.00 AS Decimal(10, 2)), CAST(270.00 AS Decimal(10, 2)), 0, CAST(N'2015-01-31' AS Date), NULL)
GO
INSERT [dbo].[Order] ([OrderId], [StoreId], [CustomerId], [OrderDate], [Subtotal], [Tax], [Total], [IsOpen], [ShipDate], [SalesPersonEmployeeId]) VALUES (1005, 1, 101, CAST(N'2016-01-29' AS Date), CAST(100.00 AS Decimal(10, 2)), CAST(8.00 AS Decimal(10, 2)), CAST(108.00 AS Decimal(10, 2)), 0, CAST(N'2016-01-31' AS Date), 8)
GO
INSERT [dbo].[Order] ([OrderId], [StoreId], [CustomerId], [OrderDate], [Subtotal], [Tax], [Total], [IsOpen], [ShipDate], [SalesPersonEmployeeId]) VALUES (1006, 2, 102, CAST(N'2016-02-02' AS Date), CAST(200.00 AS Decimal(10, 2)), CAST(16.00 AS Decimal(10, 2)), CAST(216.00 AS Decimal(10, 2)), 1, NULL, NULL)
GO
INSERT [dbo].[Order] ([OrderId], [StoreId], [CustomerId], [OrderDate], [Subtotal], [Tax], [Total], [IsOpen], [ShipDate], [SalesPersonEmployeeId]) VALUES (1007, 3, 103, CAST(N'2016-02-21' AS Date), CAST(150.00 AS Decimal(10, 2)), CAST(12.00 AS Decimal(10, 2)), CAST(162.00 AS Decimal(10, 2)), 0, CAST(N'2016-02-24' AS Date), NULL)
GO
INSERT [dbo].[Order] ([OrderId], [StoreId], [CustomerId], [OrderDate], [Subtotal], [Tax], [Total], [IsOpen], [ShipDate], [SalesPersonEmployeeId]) VALUES (1008, 4, 104, CAST(N'2016-03-14' AS Date), CAST(250.00 AS Decimal(10, 2)), CAST(20.00 AS Decimal(10, 2)), CAST(270.00 AS Decimal(10, 2)), 0, CAST(N'2016-03-31' AS Date), NULL)
GO
INSERT [dbo].[Order] ([OrderId], [StoreId], [CustomerId], [OrderDate], [Subtotal], [Tax], [Total], [IsOpen], [ShipDate], [SalesPersonEmployeeId]) VALUES (1009, 1, 101, CAST(N'2016-01-31' AS Date), CAST(100.00 AS Decimal(10, 2)), CAST(8.00 AS Decimal(10, 2)), CAST(108.00 AS Decimal(10, 2)), 0, CAST(N'2016-01-31' AS Date), 8)
GO
INSERT [dbo].[Order] ([OrderId], [StoreId], [CustomerId], [OrderDate], [Subtotal], [Tax], [Total], [IsOpen], [ShipDate], [SalesPersonEmployeeId]) VALUES (1010, 5, 102, CAST(N'2016-02-15' AS Date), CAST(200.00 AS Decimal(10, 2)), CAST(16.00 AS Decimal(10, 2)), CAST(216.00 AS Decimal(10, 2)), 0, CAST(N'2016-02-15' AS Date), NULL)
GO
INSERT [dbo].[Order] ([OrderId], [StoreId], [CustomerId], [OrderDate], [Subtotal], [Tax], [Total], [IsOpen], [ShipDate], [SalesPersonEmployeeId]) VALUES (1011, 3, 103, CAST(N'2016-02-19' AS Date), CAST(150.00 AS Decimal(10, 2)), CAST(12.00 AS Decimal(10, 2)), CAST(162.00 AS Decimal(10, 2)), 0, CAST(N'2016-02-24' AS Date), NULL)
GO
INSERT [dbo].[Order] ([OrderId], [StoreId], [CustomerId], [OrderDate], [Subtotal], [Tax], [Total], [IsOpen], [ShipDate], [SalesPersonEmployeeId]) VALUES (1012, 4, 104, CAST(N'2016-03-11' AS Date), CAST(250.00 AS Decimal(10, 2)), CAST(20.00 AS Decimal(10, 2)), CAST(270.00 AS Decimal(10, 2)), 0, CAST(N'2016-01-31' AS Date), NULL)
GO
INSERT [dbo].[Order] ([OrderId], [StoreId], [CustomerId], [OrderDate], [Subtotal], [Tax], [Total], [IsOpen], [ShipDate], [SalesPersonEmployeeId]) VALUES (1013, 6, 101, CAST(N'2016-04-29' AS Date), CAST(100.00 AS Decimal(10, 2)), CAST(8.00 AS Decimal(10, 2)), CAST(108.00 AS Decimal(10, 2)), 0, CAST(N'2016-04-30' AS Date), NULL)
GO
INSERT [dbo].[Order] ([OrderId], [StoreId], [CustomerId], [OrderDate], [Subtotal], [Tax], [Total], [IsOpen], [ShipDate], [SalesPersonEmployeeId]) VALUES (1014, 5, 102, CAST(N'2016-05-03' AS Date), CAST(200.00 AS Decimal(10, 2)), CAST(16.00 AS Decimal(10, 2)), CAST(216.00 AS Decimal(10, 2)), 0, CAST(N'2016-05-05' AS Date), NULL)
GO
INSERT [dbo].[Order] ([OrderId], [StoreId], [CustomerId], [OrderDate], [Subtotal], [Tax], [Total], [IsOpen], [ShipDate], [SalesPersonEmployeeId]) VALUES (1015, 3, 103, CAST(N'2016-06-04' AS Date), CAST(150.00 AS Decimal(10, 2)), CAST(12.00 AS Decimal(10, 2)), CAST(162.00 AS Decimal(10, 2)), 0, CAST(N'2016-06-24' AS Date), NULL)
GO
INSERT [dbo].[Order] ([OrderId], [StoreId], [CustomerId], [OrderDate], [Subtotal], [Tax], [Total], [IsOpen], [ShipDate], [SalesPersonEmployeeId]) VALUES (1016, 4, 104, CAST(N'2017-10-14' AS Date), CAST(250.00 AS Decimal(10, 2)), CAST(20.00 AS Decimal(10, 2)), CAST(270.00 AS Decimal(10, 2)), 1, NULL, NULL)
GO
SET IDENTITY_INSERT [dbo].[Order] OFF
GO
SET IDENTITY_INSERT [dbo].[Review] ON 

GO
INSERT [dbo].[Review] ([ReviewId], [Date], [CustomerId], [StoreId], [Stars], [Comments]) VALUES (1, CAST(N'2015-01-31' AS Date), 101, 1, 4, N'Good service, friendly staff.')
GO
INSERT [dbo].[Review] ([ReviewId], [Date], [CustomerId], [StoreId], [Stars], [Comments]) VALUES (2, CAST(N'2015-02-04' AS Date), 102, 2, 5, N'Great value for the price, and helpful salespeople.')
GO
SET IDENTITY_INSERT [dbo].[Review] OFF
GO
SET IDENTITY_INSERT [dbo].[Store] ON 

GO
INSERT [dbo].[Store] ([StoreId], [StoreName], [ManagerEmployeeId], [Street], [City], [State], [PostalCode], [Country], [Phone]) VALUES (1, N'Irvine', 4, N'1034 Hayes', N'Irvine', N'CA', N'92618', N'USA', N'714 555-2343')
GO
INSERT [dbo].[Store] ([StoreId], [StoreName], [ManagerEmployeeId], [Street], [City], [State], [PostalCode], [Country], [Phone]) VALUES (2, N'Tustin', 5, N'2962 El Camino Real', N'Tustin', N'CA', N'92782', N'USA', N'714 555-1616')
GO
INSERT [dbo].[Store] ([StoreId], [StoreName], [ManagerEmployeeId], [Street], [City], [State], [PostalCode], [Country], [Phone]) VALUES (3, N'Fountain Valley', 6, N'17800 Newhope St', N'Fountain Valley', N'CA', N'92708', N'USA', N'714 555-3000')
GO
INSERT [dbo].[Store] ([StoreId], [StoreName], [ManagerEmployeeId], [Street], [City], [State], [PostalCode], [Country], [Phone]) VALUES (4, N'Lake Forest', 7, N'23829 El Toro Rd', N'Lake Forest', N'CA', N'92630', N'USA', N'714 555-2111')
GO
INSERT [dbo].[Store] ([StoreId], [StoreName], [ManagerEmployeeId], [Street], [City], [State], [PostalCode], [Country], [Phone]) VALUES (5, N'Bayport', 4, N'290 Bayport Ave', N'Bayport', N'NY', N'11705', N'USA', N'631 555-6500')
GO
INSERT [dbo].[Store] ([StoreId], [StoreName], [ManagerEmployeeId], [Street], [City], [State], [PostalCode], [Country], [Phone]) VALUES (6, N'Bethpage', 5, N'383 Wantagh Ave', N'Bethpage', N'NY', N'11714', N'USA', N'714 555-1144')
GO
SET IDENTITY_INSERT [dbo].[Store] OFF
GO
USE [master]
GO
ALTER DATABASE [Dashboard] SET  READ_WRITE 
GO
